<template>
    <div>
        <NetworkData
            :context.sync="context"
            @ready="onNetworkDataReady"
        />

        <div v-if="isReady">
            <Wizard
                :context.sync="context"
            />
        </div>

        <v-tour
            :name="tourName"
            :steps="tourSteps"
            :callbacks="{ onFinish: onTourFinish, onSkip: onTourFinish }"
        />
    </div>
</template>

<script lang="ts">
import NetworkData from '#/App/Component/MiningCalculator/Calculator/NetworkData.vue';
import Wizard from '#/App/Component/MiningCalculator/Calculator/Wizard.vue';
import { Context } from '#/App/Component/MiningCalculator/Domain/Context';
import { KhalaTypes } from '#/Phala';
import BaseComponent from '@/core/app-frontend/Component/BaseComponent.vue';
import { Component } from '@inti5/app-frontend/Vue/Annotations';
import cloneDeep from 'lodash/cloneDeep';
import { namespace } from 'vuex-class';


const ClientStore = namespace('App/Client');
const RuntimeStorage = namespace('MiningCalculator/RuntimeStorage');


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


    @ClientStore.State('finishedTours')
    public finishedTours : string[];

    public tourName : string = 'mining_calc:1';
    public tourSteps = [
        {
            target: '#mining-calc-wizard [data-tour-id="step1"]',
            header: { title: 'Tokenomic params' },
            content: `Thoes values are pulled from blockchain node. Adjust it only if you know what are you doing.`,
            params: {
                placement: 'top',
                enableScrolling: false,
            }
        },
        {
            target: '#mining-calc-wizard [data-tour-id="step2"]',
            header: { title: 'Device params' },
            content: `You can pick from predefined (known) CPUs or adjust CPU params manually.`,
            params: {
                placement: 'top',
                enableScrolling: false,
            }
        },
        {
            target: '#mining-calc-wizard [data-tour-id="step3"]',
            header: { title: 'Stake' },
            content: `Specify how much of stake will you provide personally and how much you want to get from delegators. Sum has to be between minimal and maximal.`,
            params: {
                placement: 'top',
                enableScrolling: false,
            }
        },
        {
            target: '#mining-calc-wizard [data-tour-id="step4"]',
            header: { title: 'Stake pool config' },
            content: `Specify commission percent and how much of funds you want to leave free for potential withdrawal request - note more free funds - smaller rewards for all delegators.`,
            params: {
                placement: 'top',
                enableScrolling: false,
            }
        },
        {
            target: '#mining-calc-wizard [data-tour-id="step5"]',
            header: { title: 'Costs config' },
            content: `Set your electricity cost and other costs - if you have more devices just devide it equally.`,
            params: {
                placement: 'top',
                enableScrolling: false,
            }
        },
        {
            target: '#mining-calc-wizard [data-tour-id="step6"]',
            header: { title: 'Network params' },
            content: `Please fill PHA price with current (or possible future) value.`,
            params: {
                placement: 'top',
                enableScrolling: false,
            }
        },
        {
            target: '#mining-calc-wizard [data-tour-id="step7"]',
            header: { title: 'Rewards table' },
            content: `Here you will see rewards for single device. If your pool is relatively small you can multiple results by quantity. In larger pools new workers also need to be considered in calculations.`,
            params: {
                placement: 'top',
                enableScrolling: false,
            }
        }
    ];


    public async mounted ()
    {
        await this.$store.dispatch('MiningCalculator/RuntimeStorage/init');

        this.context.tokenomicParams = cloneDeep(this.tokenomicParameters);
        this.context.blockTime = this.blockTime;
        this.context.miningEra = this.miningEra;

        this.isReady = true;
    }

    public onNetworkDataReady()
    {
        if (!this.finishedTours.includes(this.tourName)) {
            this.$tours[this.tourName].start();
        }
    }

    public onTourFinish()
    {
        this.$store.commit('App/Client/finishTour', this.tourName);
    }

}
</script>
