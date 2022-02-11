<template>
    <div>
        <b-loading
            :is-full-page="true"
            v-model="readyStage != ReadyStage.Ready"
            :can-cancel="false"
        >
            <div class="loading-icon"></div>
            <div class="ml-6 pl-4">
                <div v-if="readyStage == ReadyStage.Init">
                    Initiation
                </div>
                <div v-if="readyStage == ReadyStage.NodeConnnecting">
                    Connecting to node...
                </div>
                <div v-if="readyStage == ReadyStage.PullingStakePools">
                    <p class="has-text-weight-bold">Pulling network data</p>
                    <p>
                        Stake pools: {{ networksLoaded }} / {{ networksToLoad }}
                    </p>
                    <p>
                        Workers: {{ workersLoaded }} /
                        <span v-if="workersToLoad > 0">{{ workersToLoad }}</span>
                        <span v-else>??</span>
                    </p>
                </div>
            </div>
        </b-loading>
    </div>
</template>

<script lang="ts">
import { Context } from '#/App/Component/AprCalculator/Domain/Context';
import { ApiProvider } from '#/Phala';
import BaseComponent from '@inti5/app-frontend/Component/BaseComponent.vue';
import { Component } from '@inti5/app-frontend/Vue/Annotations';
import { Inject } from '@inti5/object-manager';
import { ApiPromise } from '@polkadot/api';
import { Prop } from 'vue-property-decorator';
import * as Phala from '#/Phala';
import * as Polkadot from '#/Polkadot';
import chunk from 'lodash/chunk';


enum ReadyStage
{
    Init,
    NodeConnnecting,
    PullingStakePools,
    Ready,
}


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

    protected api : ApiPromise;

    public readyStage : ReadyStage = ReadyStage.Init;

    public networksLoaded : number = 0;
    public networksToLoad : number = 0;

    public workersLoaded : number = 0;
    public workersToLoad : number = 0;

    public async mounted ()
    {
        await this.loadNetworkData();
    }

    protected async loadNetworkData ()
    {
        this.readyStage = ReadyStage.NodeConnnecting;

        this.api = await this.apiProvider.getApi();

        this.networksToLoad = <any>(await this.api.query.phalaStakePool.poolCount()).toJSON();

        this.readyStage = ReadyStage.PullingStakePools;

        for (let onChainId = 0; onChainId < this.networksToLoad; ++onChainId) {
            this.workersLoaded = 0;

            const stakePool : typeof Phala.KhalaTypes.PoolInfo =
                <any>(await this.api.query.phalaStakePool.stakePools(onChainId)).toJSON();

            this.workersToLoad = stakePool.workers?.length ?? 0;

            for await (const workers of this.loadWorkers(stakePool.workers)) {
                for (const worker of workers) {
                    this.context.pTotal += worker.benchmark.pInstant;
                    this.context.vTotal += Phala.Utility.parseRawAmount(worker.v);

                    ++this.workersLoaded;
                }
            }

            ++this.networksLoaded;
        }

        this.readyStage = ReadyStage.Ready;
    }

    protected async *loadWorkers(workersPubKeys : string[]): AsyncGenerator<typeof Phala.KhalaTypes.MinerInfo, any, any>
    {
        const workersChunks = chunk(workersPubKeys, 50);

        for (const workersChunk of workersChunks) {
            const bindingAddresses = (await this.api.query.phalaMining.workerBindings.multi(workersChunk))
                .map(raw => raw.toString());
            yield <any>(await this.api.query.phalaMining.miners.multi(bindingAddresses)).map(raw => raw.toJSON());
        }
    }

}
</script>
