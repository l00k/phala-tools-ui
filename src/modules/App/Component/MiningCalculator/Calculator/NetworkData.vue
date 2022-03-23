<template>
    <div>
        <b-loading
            :is-full-page="true"
            :active="readyStage != ReadyStage.Ready"
            :can-cancel="false"
        >
            <div class="is-flex loading-content">
                <div class="loading-icon"></div>
                <div class="loading-text ml-6 pl-4">
                    <div v-if="readyStage == ReadyStage.Init">
                        Initiation
                    </div>
                    <div v-if="readyStage == ReadyStage.NodeConnnecting">
                        Connecting to node...
                    </div>
                    <div v-if="readyStage == ReadyStage.PullingStakePools">
                        <p class="has-text-weight-bold">Pulling network data</p>
                        <p>Stake pools: {{ stakePoolsLoaded }} / {{ stakePoolsToLoad }}</p>
                    </div>
                </div>
            </div>
        </b-loading>
    </div>
</template>

<script lang="ts">
import { Context } from '#/App/Component/MiningCalculator/Domain/Context';
import { NetworkService } from '#/App/Service/NetworkService';
import * as Phala from '#/Phala';
import { ApiProvider, MiningStates } from '#/Phala';
import { GetCached } from '@/core/app-frontend/Store/PermanentCache';
import BaseComponent from '#/AppFrontend/Component/BaseComponent.vue';
import { Component } from '#/AppFrontend/Vue/Annotations';
import { Inject } from '@inti5/object-manager';
import { ApiPromise } from '@polkadot/api';
import Decimal from 'decimal.js';
import chunk from 'lodash/chunk';
import fill from 'lodash/fill';
import { Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';


enum ReadyStage
{
    Init,
    NodeConnnecting,
    PullingStakePools,
    Ready,
}

type WorkerData = {
    minerInfo : typeof Phala.KhalaTypes.MinerInfo,
    workerInfo : typeof Phala.KhalaTypes.WorkerInfo
}

type StakePoolDto = typeof Phala.KhalaTypes.PoolInfo & {
    workersData : WorkerData[],
}


const PermanentCache = namespace('PermanentCache');


@Component({
    components: {}
})
export default class NetworkData
    extends BaseComponent
{

    protected ReadyStage = ReadyStage;

    @Inject()
    protected apiProvider : ApiProvider;

    @Prop()
    protected context : Context;

    @PermanentCache.Getter('getCached')
    protected permanentCache : GetCached;

    protected api : ApiPromise;

    public readyStage : ReadyStage = ReadyStage.Init;

    public stakePoolsLoaded : number = 0;
    public stakePoolsToLoad : number = 0;


    public async mounted ()
    {
        this.readyStage = ReadyStage.NodeConnnecting;

        this.api = await this.apiProvider.getApi();

        // load internals
        await this.$store.dispatch('MiningCalculator/RuntimeStorage/init');

        this.context.networkShares = await this.permanentCache(
            'NetworkData::networkShares',
            async() => this.loadNetworkData(),
            { lifetime: 3600 }
        );

        this.readyStage = ReadyStage.Ready;

        this.$emit('ready');
    }

    protected async loadNetworkData ()
    {
        this.stakePoolsToLoad = <any>(await this.api.query.phalaStakePool.poolCount()).toJSON();

        this.readyStage = ReadyStage.PullingStakePools;

        let totalShare = 0;

        for await (const stakePool of this.loadStakePools(this.stakePoolsToLoad)) {
            for (const { minerInfo, workerInfo } of stakePool.workersData) {
                if (!MiningStates.includes(minerInfo.state)) {
                    continue;
                }

                const workerV = (new Decimal(minerInfo.v)).div(new Decimal(2).pow(64)).toNumber();
                const workerShare = NetworkService.calculateWorkerShare(
                    workerV,
                    Number(workerInfo.confidenceLevel),
                    Number(minerInfo.benchmark.pInstant)
                );

                totalShare += workerShare;
            }

            ++this.stakePoolsLoaded;
        }

        this.readyStage = ReadyStage.Ready;

        return totalShare;
    }

    protected async* loadStakePools (stakePoolsCount : number) : AsyncGenerator<StakePoolDto, any, any>
    {
        const stakePoolIdChunks = chunk([ ...Array(stakePoolsCount).keys() ], 25);

        for (const stakePoolsIdChunk of stakePoolIdChunks) {
            const stakePoolsChunk : StakePoolDto[] =
                <any>(await this.api.query.phalaStakePool.stakePools.multi(stakePoolsIdChunk))
                    .map(raw => raw.toJSON());
            stakePoolsChunk
                .forEach(stakePool => stakePool.workersData = []);

            while (stakePoolsChunk.length) {
                const stakePoolsToLoad : StakePoolDto[] = [];
                const workersToFetch : string[] = [];
                const workerToPoolMap : number[] = [];
                let pid = 0;

                // collect workers to load
                while (workersToFetch.length < 500 && stakePoolsChunk.length) {
                    const tmpStakePool = stakePoolsChunk.shift();
                    stakePoolsToLoad.push(tmpStakePool);
                    workersToFetch.push(...tmpStakePool.workers);
                    workerToPoolMap.push(...fill(Array(tmpStakePool.workers.length), pid));

                    ++pid;
                }

                // load workers
                let wid = 0;
                for await (const worker of this.loadWorkers(workersToFetch)) {
                    const _pid = workerToPoolMap[wid++];
                    stakePoolsToLoad[_pid].workersData.push(worker);
                }

                for (const stakePool of stakePoolsToLoad) {
                    yield stakePool;
                }
            }
        }
    }

    protected async* loadWorkers (workersPubKeys : string[]) : AsyncGenerator<WorkerData, any, any>
    {
        const workersChunks = chunk(workersPubKeys, 50);

        for (const workersChunk of workersChunks) {
            const bindingAddresses = (await this.api.query.phalaMining.workerBindings.multi(workersChunk))
                .map(raw => raw.toString());
            const minerInfos = <any>(await this.api.query.phalaMining.miners.multi(bindingAddresses))
                .map(raw => raw.toJSON());
            const workerInfos = <any>(await this.api.query.phalaRegistry.workers.multi(workersChunk))
                .map(raw => raw.toJSON());

            for (let i = 0; i < workersChunk.length; ++i) {
                yield {
                    minerInfo: minerInfos[i],
                    workerInfo: workerInfos[i],
                };
            }
        }
    }

}
</script>

<style scoped lang="scss">
.loading-content {
    filter: drop-shadow(0 0 2px rgba(0,0,0, 0.8))
            drop-shadow(0 0 8px rgba(0,0,0, 0.5))
            drop-shadow(0 0 16px rgba(0,0,0, 0.3))
            ;

}
</style>
