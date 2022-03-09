<template>
    <div>
        <NetworkData
            :context.sync="context"
        />

        <div v-if="isReady">
            <Wizard
                :context.sync="context"
            />
        </div>
    </div>
</template>

<script lang="ts">
import NetworkData from '#/App/Component/AprCalculator/Calculator/NetworkData.vue';
import Wizard from '#/App/Component/AprCalculator/Calculator/Wizard.vue';
import { Context } from '#/App/Component/AprCalculator/Domain/Context';
import { KhalaTypes } from '#/Phala';
import BaseComponent from '@/core/app-frontend/Component/BaseComponent.vue';
import { Component } from '@inti5/app-frontend/Vue/Annotations';
import cloneDeep from 'lodash/cloneDeep';
import { namespace } from 'vuex-class';


const RuntimeStorage = namespace('AprCalculator/RuntimeStorage');


@Component({
    components: {
        NetworkData,
        Wizard,
    }
})
export default class Calculator
    extends BaseComponent
{

    protected isReady : boolean = false;

    protected context : Context = new Context();

    @RuntimeStorage.State('tokenomicParameters')
    protected tokenomicParameters : typeof KhalaTypes.TokenomicParameters;

    @RuntimeStorage.State('blockTime')
    protected blockTime : number;

    @RuntimeStorage.State('miningEra')
    protected miningEra : number;


    public async mounted ()
    {
        await this.$store.dispatch('AprCalculator/RuntimeStorage/init');

        this.context.tokenomicParams = cloneDeep(this.tokenomicParameters);
        this.context.blockTime = this.blockTime;
        this.context.miningEra = this.miningEra;

        this.context.phaPrice = cloneDeep(this.tokenomicParameters.phaRate);

        this.isReady = true;
    }

}
</script>
