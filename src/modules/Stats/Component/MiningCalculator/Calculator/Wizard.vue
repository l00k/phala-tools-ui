<template>
    <div
        id="mining-calc-wizard"
        class="panel is-primary"
    >
        <header class="panel-heading">
            <div class="panel-heading-title is-justify-content-space-between">
                <span>
                    Calculator
                </span>
            </div>
        </header>
        <div class="panel-block">
            <ValidationObserver
                ref="validator"
            >
                <div class="box" data-tour-id="step1">
                    <h2
                        class="title is-6"
                        @click="togglePanel('tokenomicsParams')"
                    >Tokenomics params</h2>

                    <div
                        class="is-flex"
                        :style="{
                            display: panelVisiblity.tokenomicsParams ? 'block' : 'none'
                        }"
                    >
                        <UiValidatedField
                            name="Budget per block"
                            :rules="{ required: true, numeric: true, min_value: 0 }"
                            class="mb-4 mr-2"
                        >
                            <b-input
                                v-model.number="context.budgetPerBlock"
                            />
                        </UiValidatedField>

                        <UiValidatedField
                            name="PHA rate"
                            :rules="{ required: true, numeric: true, min_value: 0 }"
                            class="mb-4 mr-2"
                        >
                            <b-input
                                v-model.number="context.tokenomicParams.phaRate"
                            />
                        </UiValidatedField>

                        <UiValidatedField
                            name="Cost K"
                            :rules="{ required: true, numeric: true, min_value: 0 }"
                            class="mb-4 mr-2"
                        >
                            <b-input
                                v-model.number="context.tokenomicParams.costK"
                            />
                        </UiValidatedField>

                        <UiValidatedField
                            name="Cost B"
                            :rules="{ required: true, numeric: true, min_value: 0 }"
                            class="mb-4 mr-2"
                        >
                            <b-input
                                v-model.number="context.tokenomicParams.costB"
                            />
                        </UiValidatedField>
                    </div>

                    <div class="is-flex">
                        <UiValidatedField
                            name="vMax"
                            :rules="{ required: true, numeric: true, min_value: 0 }"
                            class="mb-4 mr-2"
                        >
                            <b-input
                                v-model.number="context.tokenomicParams.vMax"
                            />
                        </UiValidatedField>

                        <UiValidatedField
                            name="RE"
                            :rules="{ required: true, numeric: true, min_value: 0 }"
                            class="mb-4 mr-2"
                        >
                            <b-input
                                v-model.number="context.tokenomicParams.re"
                            />
                        </UiValidatedField>

                        <UiValidatedField
                            name="K"
                            :rules="{ required: true, numeric: true, min_value: 0 }"
                            class="mb-4 mr-2"
                        >
                            <b-input
                                v-model.number="context.tokenomicParams.k"
                            />
                        </UiValidatedField>

                        <UiValidatedField
                            name="Treasury Ratio"
                            :rules="{ required: true, numeric: true, min_value: 0 }"
                            class="mb-4 mr-2"
                        >
                            <b-input
                                v-model.number="context.tokenomicParams.treasuryRatio"
                            />
                        </UiValidatedField>
                    </div>
                </div>

                <div class="box" data-tour-id="step2">
                    <h2 class="title is-6">Device params</h2>

                    <div class="is-flex">
                        <b-field
                            label="Pick from known CPUs"
                            label-position="on-border"
                        >
                            <b-select
                                v-model="selectedPredefinedDevice"
                                @input="selectPredefinedDevice"
                            >
                                <option value="celeron">
                                    Low-End Celeron
                                    <span class="has-font-size-sm">(2 cores)</span>
                                </option>
                                <option value="pentium">
                                    Low-End Pentium
                                    <span class="has-font-size-sm">(4 cores)</span>
                                </option>
                                <option value="xeon_e3">
                                    Xeon E Processor
                                    <span class="has-font-size-sm">(6 cores)</span>
                                </option>
                                <option value="i5">
                                    Mid-End i5 10-Gen
                                    <span class="has-font-size-sm">(8 cores)</span>
                                </option>
                                <option value="i9">
                                    High-End i9 9-Gen
                                    <span class="has-font-size-sm">(10 cores)</span>
                                </option>
                                <option value="xeon_hi">
                                    High-End Xeon
                                    <span class="has-font-size-sm">(20 cores)</span>
                                </option>
                            </b-select>
                        </b-field>

                        <b-tooltip
                            type="is-light"
                            position="is-right"
                        >
                            <b-icon
                                icon="triangle-exclamation"
                                type="is-warning"
                                class="ml-3 mt-1"
                            />
                            <template v-slot:content>
                                <b>Disclaimer</b><br/>
                                The author and pro-mining-team have personally tested these models, however require specialized/modded hardware to operate.<br/>
                                In no way are these specs published for hardware guides nor will be publish specific hardware details.<br/>
                                This calculator is merely meant to calculate mining profits with delegation amounts.<br/>
                                The results from the calculator might differ from your own rewards as there are more factors to consider, but should yield a best educated guess result.<br/>
                            </template>
                        </b-tooltip>
                    </div>

                    <div class="mt-3 is-flex">
                        <UiValidatedField
                            name="Score"
                            :rules="{ required: true, numeric: true, min_value: 1 }"
                            class="mr-2"
                        >
                            <b-input
                                v-model.number="context.cpuScore"
                            />
                        </UiValidatedField>

                        <div class="mr-2">
                            <UiValidatedField
                                name="Intel RA confidence level"
                                :rules="{ required: true, numeric: true, min_value: 1 }"
                                v-slot="{ errors }"
                            >
                                <b-select
                                    v-model.number="context.confidenceLevel"
                                >
                                    <option :value="1">1 - best confidence</option>
                                    <option :value="2">2</option>
                                    <option :value="3">3</option>
                                    <option :value="4">4</option>
                                    <option :value="5">5 - worst</option>
                                </b-select>
                            </UiValidatedField>
                            <div class="has-font-size-sm has-color-gray">
                                Score: {{ context.confidenceScore }}
                            </div>
                        </div>

                        <UiValidatedField
                            name="Power consumption (W)"
                            :rules="{ required: true, numeric: true, min_value: 1 }"
                            class="mr-2"
                        >
                            <b-input
                                v-model.number="context.devicePowerConsumption"
                            />
                        </UiValidatedField>

                        <UiValidatedField
                            name="Device cost (USD)"
                            :rules="{ required: true, numeric: true, min_value: 0 }"
                            class="mr-2"
                        >
                            <b-input
                                v-model.number="context.deviceCost"
                            />
                        </UiValidatedField>

                        <UiValidatedField
                            name="Device amortisation period (years)"
                            :rules="{ required: true, numeric: true, min_value: 1 }"
                            class="mr-2"
                        >
                            <b-input
                                v-model.number="context.deviceAmortisation"
                            />
                        </UiValidatedField>
                    </div>
                </div>

                <div class="box" data-tour-id="step3">
                    <h2 class="title is-6">Stake</h2>

                    <div class="is-flex">
                        <b-field
                            label="Minimal stake (PHA)"
                            label-position="on-border"
                            class="mr-2"
                        >
                            <b-input
                                :value="context.stakeMinimal"
                                :disabled="true"
                            />
                        </b-field>

                        <b-field
                            label="Maximal stake (PHA)"
                            label-position="on-border"
                        >
                            <b-input
                                :value="context.stakeMaximal"
                                :disabled="true"
                            />
                        </b-field>
                    </div>

                    <div class="is-flex mt-4">
                        <UiValidatedField
                            name="Your personal stake (PHA)"
                            :rules="{ required: true, numeric: true, min_value: 0, max_value: context.stakeMaximal }"
                            class="mr-2"
                        >
                            <b-input
                                v-model.number="context.stakePersonal"
                            />
                        </UiValidatedField>

                        <UiValidatedField
                            name="Delegators stake (PHA)"
                            :rules="{ required: true, numeric: true, min_value: 0, max_value: context.stakeMaximal }"
                            class="mr-2"
                        >
                            <b-input
                                v-model.number="context.stakeDelegators"
                            />
                        </UiValidatedField>

                        <b-field
                            label="Total device stake (PHA)"
                            label-position="on-border"
                            :type="context.isStakeValid ? 'is-success' : 'is-danger'"
                        >
                            <b-input
                                v-model.number="context.stakeTotalDevice"
                                :disabled="true"
                            />
                        </b-field>
                    </div>

                    <div class="is-flex mt-6">
                        <b-field
                            label="Worker initial V"
                            label-position="on-border"
                            class="mr-2"
                        >
                            <b-input
                                :value="context.workerInitialV"
                                :disabled="true"
                            />
                        </b-field>

                        <b-field
                            label="Further worker share"
                            label-position="on-border"
                            class="mr-2"
                        >
                            <b-input
                                v-model.number="context.forceWorkerShare"
                            />
                        </b-field>

                        <b-field
                            label="Total network shares"
                            label-position="on-border"
                            class="mr-2"
                        >
                            <b-input
                                :value="context.totalShares"
                                :disabled="true"
                            />
                        </b-field>

                        <b-field
                            label="Worker share (%)"
                            label-position="on-border"
                            class="mr-2"
                        >
                            <b-input
                                :value="(context.workerShare / context.totalShares * 100).toFixed(4)"
                                :disabled="true"
                            />
                        </b-field>
                    </div>
                </div>

                <div class="box" data-tour-id="step4">
                    <h2 class="title is-6">Stake pool config</h2>

                    <div class="is-flex">
                        <UiValidatedField
                            name="Stake pool commission (%)"
                            :rules="{ required: true, numeric: true, min_value: 0, max_value: 100 }"
                            class="mr-2"
                        >
                            <b-input
                                v-model.number="context.commissionPercent"
                            />
                        </UiValidatedField>

                        <div class="mr-2">
                            <UiValidatedField
                                name="Free (unallocated) funds in pool (PHA)"
                                :rules="{ required: true, numeric: true, min_value: 0 }"
                            >
                                <b-input
                                    v-model.number="context.stakeFree"
                                />
                            </UiValidatedField>
                            <div class="has-font-size-sm has-color-gray">
                                Causes rewards leeching
                            </div>
                        </div>
                    </div>

                    <div class="is-flex mt-4">
                        <b-field
                            label="Owner rewards fraction (%)"
                            label-position="on-border"
                            class="mr-2"
                        >
                            <b-input
                                :value="(context.ownerFraction * 100).toFixed(5)"
                                :disabled="true"
                            />
                        </b-field>
                    </div>
                </div>

                <div class="box" data-tour-id="step5">
                    <h2 class="title is-6">Cost config</h2>

                    <div class="is-flex">
                        <UiValidatedField
                            name="Elect. cost (USD/kWh)"
                            :rules="{ required: true, numeric: true, min_value: 0 }"
                            class="mr-2"
                        >
                            <b-input
                                v-model.number="context.electricityCost"
                            />
                        </UiValidatedField>

                        <div class="mr-2">
                            <UiValidatedField
                                name="Other costs monthly (USD)"
                                :rules="{ required: true, numeric: true, min_value: 0 }"
                            >
                                <b-input
                                    v-model.number="context.otherCosts"
                                />
                            </UiValidatedField>
                            <div class="has-font-size-sm has-color-gray">
                                e.g. internet / maintainment
                            </div>
                        </div>
                    </div>
                </div>

                <div class="box" data-tour-id="step6">
                    <h2 class="title is-6">Network params</h2>

                    <div class="is-flex">
                        <UiValidatedField
                            name="PHA price (USD)"
                            :rules="{ required: true, numeric: true, min_value: 0.0001 }"
                            class="mr-2"
                        >
                            <b-input
                                v-model.number="context.phaPrice"
                            />
                        </UiValidatedField>

                        <UiValidatedField
                            name="Block time (s)"
                            :rules="{ required: true, numeric: true, min_value: 1 }"
                            class="mb-4 mr-2"
                        >
                            <b-input
                                v-model.number="context.blockTime"
                            />
                        </UiValidatedField>

                        <UiValidatedField
                            name="Further halvings"
                            :rules="{ required: true, numeric: true, min_value: 0 }"
                            class="mr-2"
                        >
                            <b-input
                                v-model.number="context.miningEra"
                            />
                        </UiValidatedField>

                        <UiValidatedField
                            name="Rewards fraction caused by halvings (%)"
                            :rules="{ required: true, numeric: true, min_value: 0 }"
                            class="mr-2"
                        >
                            <b-input
                                :value="(context.rewardsFractionInEra * 100).toFixed(4)"
                                :disabled="true"
                            />
                        </UiValidatedField>
                    </div>
                </div>

                <div class="box mt-6">
                    <h2 class="title is-6 has-color-primary">Results</h2>

                    <div class="mb-4 pl-6">
                        <div class="result-badge">
                            <span class="label">pool APR</span>
                            <span class="value">{{ context.poolApr | formatPercent('0.00%') }}</span>
                        </div>
                    </div>

                    <h2 class="title is-6 has-color-primary">Owner rewards</h2>

                    <table class="results-table is-100-wide" data-tour-id="step7">
                        <tr>
                            <th></th>
                            <th>Rewards (PHA)</th>
                            <th>Elect. cost</th>
                            <th>Device amortisation</th>
                            <th>Other costs</th>
                            <th>Revenue</th>
                            <th>Total costs</th>
                            <th>Income</th>
                        </tr>
                        <tr>
                            <th>Daily</th>
                            <td>{{ resultsDaily.rewards | formatCoin }} PHA</td>
                            <td>{{ resultsDaily.electricityCost | formatCoin }} $</td>
                            <td>{{ resultsDaily.deviceAmortisation | formatCoin }} $</td>
                            <td>{{ resultsDaily.otherCosts | formatCoin }} $</td>
                            <td>{{ resultsDaily.revenue | formatCoin }} $</td>
                            <td>{{ resultsDaily.totalCosts | formatCoin }} $</td>
                            <td>{{ resultsDaily.income | formatCoin }} $</td>
                        </tr>
                        <tr>
                            <th>Monthly</th>
                            <td>{{ resultsMonthly.rewards | formatCoin }} PHA</td>
                            <td>{{ resultsMonthly.electricityCost | formatCoin }} $</td>
                            <td>{{ resultsMonthly.deviceAmortisation | formatCoin }} $</td>
                            <td>{{ resultsMonthly.otherCosts | formatCoin }} $</td>
                            <td>{{ resultsMonthly.revenue | formatCoin }} $</td>
                            <td>{{ resultsMonthly.totalCosts | formatCoin }} $</td>
                            <td>{{ resultsMonthly.income | formatCoin }} $</td>
                        </tr>
                    </table>
                </div>

            </ValidationObserver>
        </div>
    </div>
</template>

<script lang="ts">
import { Context } from '#/Stats/Component/MiningCalculator/Domain/Context';
import { NetworkService } from '#/Stats/Service/NetworkService';
import * as Phala from '#/Phala';
import BaseComponent from '#/FrontendCore/Component/BaseComponent.vue';
import { Component } from '#/FrontendCore/Vue/Annotations';
import { Prop, Watch } from 'vue-property-decorator';


class ResultInPeriod
{
    public rewards : number = 0;
    public electricityCost : number = 0;
    public deviceAmortisation : number = 0;
    public otherCosts : number = 0;
    public revenue : number = 0;
    public totalCosts : number = 0;
    public income : number = 0;
};


@Component()
export default class Wizard
    extends BaseComponent
{

    protected static readonly PREDEFINED_DEVICES = {
        celeron: {
            cpuCores: 2,
            cpuScore: 250,
            devicePowerConsumption: 18,
            confidenceLevel: 1,
            deviceCost: 200,
        },
        pentium: {
            cpuCores: 4,
            cpuScore: 520,
            devicePowerConsumption: 18,
            confidenceLevel: 1,
            deviceCost: 300,
        },
        xeon_e3: {
            cpuCores: 6,
            cpuScore: 1900,
            devicePowerConsumption: 120,
            confidenceLevel: 2,
            deviceCost: 0,
        },
        i5: {
            cpuCores: 8,
            cpuScore: 2000,
            devicePowerConsumption: 125,
            confidenceLevel: 4,
            deviceCost: 450,
        },
        i9: {
            cpuCores: 10,
            cpuScore: 2800,
            devicePowerConsumption: 125,
            confidenceLevel: 4,
            deviceCost: 625,
        },
        xeon_hi: {
            cpuCores: 20,
            cpuScore: 10000,
            devicePowerConsumption: 250,
            confidenceLevel: 2,
            deviceCost: 0,
        }
    }

    @Prop()
    public context : Context;

    public selectedPredefinedDevice : string = '';

    public resultsDaily : ResultInPeriod = new ResultInPeriod();
    public resultsMonthly : ResultInPeriod = new ResultInPeriod();

    public panelVisiblity : Record<string, boolean> = {
        tokenomicsParams: false
    };


    public mounted()
    {
        (<any>this.$refs.validator).validate();
    }


    public selectPredefinedDevice(deviceKey : string)
    {
        const device = Wizard.PREDEFINED_DEVICES[deviceKey];
        for (const [prop, value] of Object.entries(device)) {
            this.$set(this.context, prop, value);
        }

        this.selectedPredefinedDevice = null;
    }

    @Watch('context', { deep: true })
    public calculateResults (after : Context, before : Context)
    {
        if (this.context.forceWorkerShare) {
            this.context.workerShare = this.context.forceWorkerShare;
        }
        else {
            // recalculate shares
            this.context.workerShare = NetworkService.calculateWorkerShare(
                this.context.workerInitialV,
                this.context.confidenceLevel,
                this.context.cpuScore
            );
        }

        this.resultsDaily.rewards = this.context.ownerRewardsDaily;
        this.resultsDaily.electricityCost = this.context.devicePowerConsumption * 24 / 1000 * this.context.electricityCost;
        this.resultsDaily.deviceAmortisation = this.context.deviceCost / (this.context.deviceAmortisation * 365);
        this.resultsDaily.otherCosts = this.context.otherCosts / 30;
        this.resultsDaily.revenue = this.resultsDaily.rewards * this.context.phaPrice;
        this.resultsDaily.totalCosts = this.resultsDaily.electricityCost
            + this.resultsDaily.deviceAmortisation
            + this.resultsDaily.otherCosts;
        this.resultsDaily.income = this.resultsDaily.revenue - this.resultsDaily.totalCosts;

        for (const [prop, value] of Object.entries(this.resultsDaily)) {
            this.resultsMonthly[prop] = value * 30;
        }
    }

    public togglePanel(panelName)
    {
        this.$set(this.panelVisiblity, panelName, !this.panelVisiblity[panelName]);
    }

}
</script>

<style lang="scss">
.result-badge {
    display: inline-block;

    .label {
        display: inline-block;
        font-size: 1rem;
    }
    .value {
        display: inline-block;
        margin-left: 10px;
        font-size: 2.5rem;
        font-weight: bold;
        color: $primary;
    }
}

table.results-table {
    th, td {
        padding: 0.25rem 1rem;
        text-align: right;
    }
}
</style>
