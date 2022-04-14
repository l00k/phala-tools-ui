<template>
    <div class="panel is-primary">
        <header class="panel-heading">
            <div class="panel-heading-title is-justify-content-space-between">
                <span v-if="formMode == FormMode.Create">
                    Create new stake pool observation
                </span>
                <span v-else-if="formMode == FormMode.Edit">
                    Edit stake pool observation
                </span>
            </div>
        </header>
        <div class="panel-block p-5">

            <UiForm
                ref="form"
                :formData="observation"
                @change="onAnyChange"
                :submit="onSubmit"
                :reset="onReset"
                v-slot="{ isValid, isProcessing, doReset, doSubmit }"
            >
                <div class="columns">
                    <div class="column is-6">
                        <UiValidatedField
                            field="stakePool"
                            name="Stake pool (pick from autocomplete list)"
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
                        <b-field
                            label="Current value"
                            label-position="on-border"
                            class="pt-2"
                        >
                            <div v-if="observation.stakePool">
                                <span class="has-text-weight-bold has-color-primary">#{{ observation.stakePool.onChainId }}</span>
                                <span class="ml-4">
                                    {{ observation.stakePool?.owner?.identity }}
                                </span>
                            </div>
                            <div
                                v-else
                                class="has-color-red"
                            >
                                Not selected
                            </div>
                        </b-field>
                    </div>
                </div>

                <div class="columns">
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
                    class="columns is-multiline"
                >
                    <div class="column is-6">
                        <UiValidatedField
                            name="Delegator address"
                            :rules="{ isPolkadotAddress: 30 }"
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
                    <div class="column is-6">
                        <b-field
                            label="Current value"
                            label-position="on-border"
                            class="pt-2"
                        >
                            <AccountBadge
                                v-if="observation.account"
                                :account="observation.account"
                            />
                            <div
                                v-else
                                class="has-color-red"
                            >
                                Not selected
                            </div>
                        </b-field>
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
                                    v-model="observation.config[ObservationType.ClaimableRewards].active"
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
                                    v-model.number="observation.config[ObservationType.ClaimableRewards].frequency"
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
                                    v-model.number="observation.config[ObservationType.ClaimableRewards].threshold"
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
                                    v-model="observation.config[ObservationType.RewardsDrop].active"
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
                                    v-model.number="observation.config[ObservationType.RewardsDrop].frequency"
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
                                    v-model.number="observation.config[ObservationType.RewardsDrop].threshold"
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
                                    v-model="observation.config[ObservationType.PoolCommissionChange].active"
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
                                    v-model.number="observation.config[ObservationType.PoolCommissionChange].frequency"
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
                                    v-model.number="observation.config[ObservationType.PoolCommissionChange].threshold"
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
                                    v-model="observation.config[ObservationType.UnresponsiveWorker].active"
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
                                    v-model.number="observation.config[ObservationType.UnresponsiveWorker].frequency"
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
                                :rules="{ required: true, integer: true, min_value: 1 }"
                            >
                                <b-input
                                    v-model.number="observation.config[ObservationType.UnresponsiveWorker].threshold"
                                />
                                <p class="control">
                                    <span class="button is-disabled">workers</span>
                                </p>
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
                                    v-model="observation.config[ObservationType.NodeStuck].active"
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
                                    v-model.number="observation.config[ObservationType.NodeStuck].frequency"
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
                                    v-model="observation.config[ObservationType.FreePoolFunds].active"
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
                                    v-model.number="observation.config[ObservationType.FreePoolFunds].frequency"
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
                                    v-model.number="observation.config[ObservationType.FreePoolFunds].threshold"
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
                                    v-model="observation.config[ObservationType.PendingWithdrawals].active"
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
                                    v-model.number="observation.config[ObservationType.PendingWithdrawals].frequency"
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
                                    v-model.number="observation.config[ObservationType.PendingWithdrawals].threshold"
                                />
                                <p class="control">
                                    <span class="button is-disabled">PHA</span>
                                </p>
                            </UiValidatedField>
                        </td>
                    </tr>

                </table>

                <div class="mt-5 is-flex is-justify-content-space-between">
                    <b-button
                        type="is-warning"
                        :disabled="isProcessing"
                        :loading="isProcessing"
                        @click="doReset"
                    >Reset</b-button>
                    <b-button
                        type="is-success"
                        :disabled="isProcessing"
                        :loading="isProcessing"
                        @click="doSubmit"
                    >Save</b-button>
                </div>
            </UiForm>
        </div>
    </div>
</template>

<script lang="ts">
import BaseComponent from '#/FrontendCore/Component/BaseComponent.vue';
import { Component } from '#/FrontendCore/Vue/Annotations';
import { StakePool } from '#/Phala/Domain/Model/StakePool';
import AccountBadge from '#/Watchdog/Component/AccountBadge.vue';
import { Observation } from '#/Watchdog/Domain/Model/Observation';
import { StakePoolService } from '#/Phala/Domain/Service/StakePoolService';
import { ObservationService } from '#/Watchdog/Domain/Service/ObservationService';
import * as Api from '@inti5/api-frontend';
import { Annotation as API } from '@inti5/api-frontend';
import { AccountService } from '#/Phala/Domain/Service/AccountService';
import cloneDeep from 'lodash/cloneDeep';
import * as Polkadot from '#/Polkadot';
import { Ref, Watch } from 'vue-property-decorator';
import { ObservationType } from '#/Watchdog/Domain/Type/ObservationType';
import { ObservationConfiguration } from '#/Watchdog/Domain/Model/Observation/ObservationConfiguration';
import { ValidationException } from '@inti5/validator/ValidationException';
import { ObservationMode } from '#/Watchdog/Domain/Type/ObservationMode';


export enum FormMode {
    Create = 'Create',
    Edit = 'Edit',
}


@Component({
    components: {
        AccountBadge
    }
})
export default class ObservationForm
    extends BaseComponent
{

    @API.InjectClient()
    protected _apiClient : Api.Client;

    protected _observationService : ObservationService;
    protected _stakePoolService : StakePoolService;
    protected _accountService : AccountService;


    @Ref('form')
    protected $form : any;


    public FormMode = FormMode;
    public ObservationType = ObservationType;
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

    public originalObservation : Observation = new Observation();

    public formMode : FormMode = null;
    public observation : Observation = new Observation();

    public observationAccountAddress : string = '';

    public isModified : boolean = false;


    public mounted()
    {
        this._observationService = this._apiClient.getService(ObservationService);
        this._stakePoolService = this._apiClient.getService(StakePoolService);
        this._accountService = this._apiClient.getService(AccountService);
    }

    public setupCreateForm()
    {
        this.originalObservation = new Observation();
        this.formMode = FormMode.Create;

        this._setup();
    }

    public setupEditForm(observation : Observation)
    {
        this.originalObservation = observation;
        this.formMode = FormMode.Edit;

        this._setup();
    }

    protected _setup()
    {
        this.observation = cloneDeep(this.originalObservation);

        this.observationAccountAddress = this.observation.account?.address;
        if (!this.observation.config) {
            this.observation.config = new ObservationConfiguration();
        }
    }


    public onAnyChange()
    {
        this.isModified = true;
        this.$emit('change');
    }

    @Watch('observationAccountAddress')
    public async onObservationAccountChange(address : string)
    {
        if (address) {
            const valid = Polkadot.Utility.isAddress(address, 30);
            if (!valid) {
                return;
            }

            if (this.observation.account?.address == address) {
                // already loaded
                return;
            }

            // try to load account
            try {
                this.observation.account = await this._accountService.findAccount(address);
            }
            catch (e : any) {
                if (e instanceof ValidationException) {
                    const errors : string[] = e.details.errors[0].map(error => error.error ?? error.rule);
                    this.showToast({
                        type: 'is-danger',
                        message: errors.join('\n')
                    });
                }
            }
        }
        else {
            this.observation.account = null;
            return;
        }
    }

    public async doSearchStakePool(term : string) : Promise<StakePool[]>
    {
        if (!term) {
            return [];
        }

        const collection = await this._stakePoolService
            .getCollection(null, `#PATH#/find/${term}`);

        return collection.items;
    }


    public onReset()
    {
        this.observation = cloneDeep(this.originalObservation);
    }

    public async onSubmit()
    {
        const action = this.formMode.toLowerCase();

        try {
            let result = null;

            if (this.formMode == FormMode.Create) {
                result = await this._observationService.create(this.observation);
            }
            else if (this.formMode == FormMode.Edit) {
                result = await this._observationService.update(this.observation);
            }

            this.isModified = false;

            this.showNotification({
                type: 'is-success',
                message: this.formMode === FormMode.Create
                    ? 'Successfully created'
                    : 'Successfully updated',
            });

            // emit events
            this.$emit('submit:success', result, this.formMode);
            this.$emit(`${action}:success`, result, this.formMode);
        }
        catch (e : any) {
            this.showNotification({
                type: 'is-danger',
                message: e.message + ' #' + e.code,
            });

            this.$emit('submit:failure', e, this.formMode);
            this.$emit(`${action}:failure`, e, this.formMode);
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
