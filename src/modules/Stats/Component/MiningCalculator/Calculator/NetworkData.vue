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
                </div>
            </div>
        </b-loading>
    </div>
</template>

<script lang="ts">
import { Context } from '#/Stats/Component/MiningCalculator/Domain/Context';
import { NetworkStateService } from '#/Stats/Domain/Service/NetworkStateService';
import * as Phala from '#/Phala';
import BaseComponent from '#/FrontendCore/Component/BaseComponent.vue';
import { Component } from '#/FrontendCore/Vue/Annotations';
import { InjectService } from '@inti5/api-frontend/Annotation';
import { Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';


enum ReadyStage
{
    Init,
    NodeConnnecting,
    Ready,
}


@Component({
    components: {}
})
export default class NetworkData
    extends BaseComponent
{

    @InjectService()
    protected _networkStateService : NetworkStateService;


    public ReadyStage = ReadyStage;

    @Prop()
    public context : Context;

    public readyStage : ReadyStage = ReadyStage.Init;


    public async mounted ()
    {
        this.readyStage = ReadyStage.NodeConnnecting;

        // load internals
        await this.$store.dispatch('MiningCalculator/RuntimeStorage/init');

        const networkState = await this._networkStateService.getLatestNetworkState();
        this.context.totalShares = networkState.totalShares;
        this.context.phaPrice = networkState.phaPrice;

        this.readyStage = ReadyStage.Ready;

        this.$emit('ready');
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
