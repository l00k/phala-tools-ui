<template>
    <div class="panel is-primary">
        <header class="panel-heading">
            <div class="panel-heading-title is-justify-content-space-between">
                <span v-if="formMode == FormMode.Create">
                    Create new stake pool observation
                </span>
                <span v-else-if="formMode == FormMode.Edit">
                    Edit stake pool observation #{{ observation.stakePool.onChainId }}
                </span>
            </div>
        </header>
        <div class="panel-block p-5">

            <UiForm
                ref="form"
                :formData="observation"
                @change="onAnyChange"
                @submit="onSubmit"
            >
                <div class="columns">
                    <div class="column is-6">
                        <UiValidatedField
                            name="Stake pool"
                            :rules="{ required: true }"
                        >
                            <UiAutocompleteField
                                v-model="observation.stakePool"
                                :searchFunction="doSearchStakePool"
                                trackField="onChainId"
                            >
                                <template slot-scope="{ option }">
                                    <div class="has-text-weight-bold">#{{ option.onChainId }}</div>
                                    <div>{{ option.owner.identity }}</div>
                                </template>
                            </UiAutocompleteField>
                        </UiValidatedField>
                    </div>
                    <div class="column is-6">
                        <UiValidatedField
                            name="Observe as"
                            :rules="{ required: true }"
                            class="mb-4 mr-2"
                        >
                            <b-radio-button
                                v-model="observation.mode"
                                :native-value="ObservationMode.Owner"
                                type="is-success"
                            >
                                <b-icon pack="fab" icon="redhat"></b-icon>
                                <span>Owner</span>
                            </b-radio-button>
                            <b-radio-button
                                v-model="observation.mode"
                                :native-value="ObservationMode.Delegator"
                                type="is-warning"
                            >
                                <b-icon icon="sack-dollar"></b-icon>
                                <span>Delegator</span>
                            </b-radio-button>
                        </UiValidatedField>
                    </div>
                </div>

                <div
                    v-if="observation.mode == ObservationMode.Delegator"
                    class="columns"
                >
                    <div class="column is-6">
                        <UiValidatedField
                            name="Delegator address"
                            :rules="{ isPolkadotAddress: true }"
                        >
                            <b-input
                                v-model.lazy="observationAccountAddress"
                                :maxlength="48"
                            />
                        </UiValidatedField>

                        <div class="pl-2 has-color-gray">
                            In case you are observing pool as delegator it is prefered to provide delegator address.
                            If you not provide it - you will be not able to get notifications about pending rewards.
                        </div>
                    </div>
                </div>

                <h4 class="title is-6">Notifications</h4>

                <table
                    class="is-100-wide"
                >
                    <tr>
                        <td width="10%"></td>
                        <td width="40%"></td>
                        <td></td>
                        <td></td>
                    </tr>

                    <!-- CLAIMABLE REWARDS -->
                    <tr
                        class="config-row"
                        :class="{ 'is-row-disabled': observation.mode == ObservationMode.Delegator && !observation.account }"
                    >
                        <td>
                            <UiValidatedField
                                name="Active"
                            >
                                <b-switch
                                    v-model="observation.config[NotificationType.ClaimableRewards].active"
                                />
                            </UiValidatedField>
                        </td>
                        <td class="no-filter">
                            Pending claimable rewards
                            <div
                                v-if="observation.mode == ObservationMode.Delegator && !observation.account"
                                class="has-color-red"
                            >
                                Delegator account required!
                            </div>
                        </td>
                        <td>
                            <UiValidatedField
                                name="Frequency"
                                :rules="{ required: true, oneOf: Object.keys(frequencyOptions) }"
                            >
                                <b-select
                                    v-model.number="observation.config[NotificationType.ClaimableRewards].frequency"
                                >
                                    <option
                                        v-for="([value, label]) in Object.entries(frequencyOptions)"
                                        :key="value"
                                        :value="value"
                                    >{{ label }}</option>
                                </b-select>
                            </UiValidatedField>
                        </td>
                        <td>
                            <UiValidatedField
                                name="Threshold"
                                :rules="{ required: true, integer: true, min_value: 0 }"
                            >
                                <b-input
                                    v-model.number="observation.config[NotificationType.ClaimableRewards].threshold"
                                />
                                <p class="control">
                                    <span class="button is-disabled">PHA</span>
                                </p>
                            </UiValidatedField>
                        </td>
                    </tr>

                    <!-- REWARDS DROP -->
                    <tr
                        class="config-row"
                    >
                        <td>
                            <UiValidatedField
                                name="Active"
                            >
                                <b-switch
                                    v-model="observation.config[NotificationType.RewardsDrop].active"
                                />
                            </UiValidatedField>
                        </td>
                        <td>
                            Rewards decreased
                        </td>
                        <td>
                            <UiValidatedField
                                name="Frequency"
                                :rules="{ required: true, oneOf: Object.keys(frequencyOptions) }"
                            >
                                <b-select
                                    v-model.number="observation.config[NotificationType.RewardsDrop].frequency"
                                >
                                    <option
                                        v-for="([value, label]) in Object.entries(frequencyOptions)"
                                        :key="value"
                                        :value="value"
                                    >{{ label }}</option>
                                </b-select>
                            </UiValidatedField>

                        </td>
                        <td>
                            <UiValidatedField
                                name="Threshold"
                                :rules="{ required: true, integer: true, min_value: 0, max_value: 100 }"
                            >
                                <b-input
                                    v-model.number="observation.config[NotificationType.RewardsDrop].threshold"
                                />
                                <p class="control">
                                    <span class="button is-disabled">%</span>
                                </p>
                            </UiValidatedField>
                        </td>
                    </tr>

                    <!-- POOL COMMISSION CHANGE -->
                    <tr
                        v-if="observation.mode == ObservationMode.Delegator"
                        class="config-row"
                    >
                        <td>
                            <UiValidatedField
                                name="Active"
                            >
                                <b-switch
                                    v-model="observation.config[NotificationType.PoolCommissionChange].active"
                                />
                            </UiValidatedField>
                        </td>
                        <td>
                            Pool commission change
                        </td>
                        <td>
                            <UiValidatedField
                                name="Frequency"
                                :rules="{ required: true, oneOf: Object.keys(frequencyOptions) }"
                            >
                                <b-select
                                    v-model.number="observation.config[NotificationType.PoolCommissionChange].frequency"
                                >
                                    <option
                                        v-for="([value, label]) in Object.entries(frequencyOptions)"
                                        :key="value"
                                        :value="value"
                                    >{{ label }}</option>
                                </b-select>
                            </UiValidatedField>

                        </td>
                        <td>
                            <UiValidatedField
                                name="Threshold"
                                :rules="{ required: true, integer: true, min_value: 0, max_value: 100 }"
                            >
                                <b-input
                                    v-model.number="observation.config[NotificationType.PoolCommissionChange].threshold"
                                />
                                <p class="control">
                                    <span class="button is-disabled">%</span>
                                </p>
                            </UiValidatedField>
                        </td>
                    </tr>

                    <!-- UNRESPONSIVE WORKER -->
                    <tr
                        v-if="observation.mode == ObservationMode.Owner"
                        class="config-row"
                    >
                        <td>
                            <UiValidatedField
                                name="Active"
                            >
                                <b-switch
                                    v-model="observation.config[NotificationType.UnresponsiveWorker].active"
                                />
                            </UiValidatedField>
                        </td>
                        <td>
                            Unresponsive worker
                        </td>
                        <td>
                            <UiValidatedField
                                name="Frequency"
                                :rules="{ required: true, oneOf: Object.keys(frequencyOptions) }"
                            >
                                <b-select
                                    v-model.number="observation.config[NotificationType.UnresponsiveWorker].frequency"
                                >
                                    <option
                                        v-for="([value, label]) in Object.entries(frequencyOptions)"
                                        :key="value"
                                        :value="value"
                                    >{{ label }}</option>
                                </b-select>
                            </UiValidatedField>

                        </td>
                    </tr>

                    <!-- NODE STUCK -->
                    <tr
                        v-if="observation.mode == ObservationMode.Owner"
                        class="config-row"
                    >
                        <td>
                            <UiValidatedField
                                name="Active"
                            >
                                <b-switch
                                    v-model="observation.config[NotificationType.NodeStuck].active"
                                />
                            </UiValidatedField>
                        </td>
                        <td>
                            Node stuck<br/>
                            <span class="has-font-size-sm">(not processing blocks)</span>
                        </td>
                        <td>
                            <UiValidatedField
                                name="Frequency"
                                :rules="{ required: true, oneOf: Object.keys(frequencyOptions) }"
                            >
                                <b-select
                                    v-model.number="observation.config[NotificationType.NodeStuck].frequency"
                                >
                                    <option
                                        v-for="([value, label]) in Object.entries(frequencyOptions)"
                                        :key="value"
                                        :value="value"
                                    >{{ label }}</option>
                                </b-select>
                            </UiValidatedField>

                        </td>
                    </tr>

                    <!-- FREE POOL FUNDS -->
                    <tr
                        v-if="observation.mode == ObservationMode.Owner"
                        class="config-row"
                    >
                        <td>
                            <UiValidatedField
                                name="Active"
                            >
                                <b-switch
                                    v-model="observation.config[NotificationType.FreePoolFunds].active"
                                />
                            </UiValidatedField>
                        </td>
                        <td>
                            Free pending funds in pool
                        </td>
                        <td>
                            <UiValidatedField
                                name="Frequency"
                                :rules="{ required: true, oneOf: Object.keys(frequencyOptions) }"
                            >
                                <b-select
                                    v-model.number="observation.config[NotificationType.FreePoolFunds].frequency"
                                >
                                    <option
                                        v-for="([value, label]) in Object.entries(frequencyOptions)"
                                        :key="value"
                                        :value="value"
                                    >{{ label }}</option>
                                </b-select>
                            </UiValidatedField>

                        </td>
                        <td>
                            <UiValidatedField
                                name="Threshold"
                                :rules="{ required: true, integer: true, min_value: 0 }"
                            >
                                <b-input
                                    v-model.number="observation.config[NotificationType.FreePoolFunds].threshold"
                                />
                                <p class="control">
                                    <span class="button is-disabled">PHA</span>
                                </p>
                            </UiValidatedField>
                        </td>
                    </tr>

                    <!-- PENDING WITHDRAWALS -->
                    <tr
                        v-if="observation.mode == ObservationMode.Owner"
                        class="config-row"
                    >
                        <td>
                            <UiValidatedField
                                name="Active"
                            >
                                <b-switch
                                    v-model="observation.config[NotificationType.PendingWithdrawals].active"
                                />
                            </UiValidatedField>
                        </td>
                        <td>
                            Pending withdrawals in pool queue
                        </td>
                        <td>
                            <UiValidatedField
                                name="Frequency"
                                :rules="{ required: true, oneOf: Object.keys(frequencyOptions) }"
                            >
                                <b-select
                                    v-model.number="observation.config[NotificationType.PendingWithdrawals].frequency"
                                >
                                    <option
                                        v-for="([value, label]) in Object.entries(frequencyOptions)"
                                        :key="value"
                                        :value="value"
                                    >{{ label }}</option>
                                </b-select>
                            </UiValidatedField>

                        </td>
                        <td>
                            <UiValidatedField
                                name="Threshold"
                                :rules="{ required: true, integer: true, min_value: 0 }"
                            >
                                <b-input
                                    v-model.number="observation.config[NotificationType.PendingWithdrawals].threshold"
                                />
                                <p class="control">
                                    <span class="button is-disabled">PHA</span>
                                </p>
                            </UiValidatedField>
                        </td>
                    </tr>

                </table>

            </UiForm>
        </div>
    </div>
</template>

<script lang="ts">
import BaseComponent from '#/FrontendCore/Component/BaseComponent.vue';
import { Component } from '#/FrontendCore/Vue/Annotations';
import { StakePool } from '#/Watchdog/Domain/Model/StakePool';
import { StakePoolObservation, ObservationMode } from '#/Watchdog/Domain/Model/StakePool/StakePoolObservation';
import { StakePoolService } from '#/Watchdog/Domain/Service/StakePoolService';
import * as Api from '@/core/api-frontend';
import { Annotation as API } from '@/core/api-frontend';
import { AccountService } from '#/Watchdog/Domain/Service/AccountService';
import cloneDeep from 'lodash/cloneDeep';
import * as Polkadot from '#/Polkadot';
import { Watch } from 'vue-property-decorator';
import { NotificationType } from '#/Watchdog/Domain/Model/StakePool/Observation/ObservationNotifications';
import { ObservationConfiguration } from '#/Watchdog/Domain/Model/StakePool/Observation/ObservationConfiguration';


enum FormMode {
    Create = 'Create',
    Edit = 'Edit',
}


@Component()
export default class StakePoolObservationForm
    extends BaseComponent
{

    @API.InjectClient('watchdog')
    protected _apiClient : Api.Client;

    protected _stakePoolService : StakePoolService;
    protected _accountService : AccountService;


    public FormMode = FormMode;
    public NotificationType = NotificationType;
    public ObservationMode = ObservationMode;

    public frequencyOptions = {
        900 : '15 min',
        3600  : '1 hour',
        14400 : '4 hours',
        43200 : '12 hours',
        86400 : '1 day',
        172800 : '2 days',
        345600 : '4 days',
        604800 : '7 days',
    };

    public observation : StakePoolObservation = new StakePoolObservation();
    public formMode : FormMode = null;

    public observationAccountAddress : string = '';

    public isModified : boolean = false;


    public mounted()
    {
        this._stakePoolService = this._apiClient.getService(StakePoolService);
        this._accountService = this._apiClient.getService(AccountService);
    }

    public setupCreateForm()
    {
        this.observation = new StakePoolObservation();
        this.formMode = FormMode.Create;

        this._setup();
    }

    public setupEditForm(observation : StakePoolObservation)
    {
        this.observation = cloneDeep(observation);
        this.formMode = FormMode.Edit;

        this._setup();
    }

    protected _setup()
    {
        this.observationAccountAddress = this.observation.account?.address;
        if (!this.observation.config) {
            this.observation.config = new ObservationConfiguration();
        }
    }

    public async doSearchStakePool(term : string) : Promise<StakePool[]>
    {
        const collection = await this._stakePoolService
            .getCollection(null, `#PATH#/find/${term}`);

        return collection.items;
    }

    public onAnyChange()
    {
        this.isModified = true;
        this.$emit('change');
    }

    public onSubmit()
    {
        console.log(this.observation);
    }

    @Watch('observationAccountAddress')
    public async onObservationAccountChange(address : string)
    {
        if (address) {
            const valid = Polkadot.Utility.isAddress(address);
            if (!valid) {
                return;
            }

            if (this.observation.account?.address == address) {
                // already loaded
                return;
            }

            // try to load account
            this.observation.account = await this._accountService.findAccount(address);
        }
        else {
            this.observation.account = null;
            return;
        }
    }

}
</script>

<style scoped lang="scss">
.config-row {
    td {
        padding: 0.5rem 0;
    }

    &.is-row-disabled {
        td:not(.no-filter) {
            pointer-events: none;
            opacity: 0.7;
            filter: grayscale(1) brightness(50%);
        }
    }
}
</style>
