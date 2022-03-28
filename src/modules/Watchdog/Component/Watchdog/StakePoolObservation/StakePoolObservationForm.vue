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
        <div class="panel-block pt-5">
            <ValidationObserver
                ref="validator"
                @change="onAnyChange"
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

                <div
                    class="columns"
                    :class="{ 'is-row-disabled': observation.mode == ObservationMode.Delegator && !observation.account }"
                >
                    <div class="column is-2">
                        <UiValidatedField
                            name="Active"
                        >
                            <b-switch
                                v-model="observation.config[NotificationType.ClaimableRewards].active"
                            />
                        </UiValidatedField>
                    </div>
                    <div class="column is-4">
                        Pending claimable rewards
                        <div
                            v-if="observation.mode == ObservationMode.Delegator && !observation.account"
                            class="has-color-red"
                        >
                            Delegator account required!
                        </div>
                    </div>
                    <div class="column is-6 is-flex is-flow-direction-row">
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

                        <UiValidatedField
                            name="Threshold"
                            :rules="{ required: true, integer: true, min_value: 0 }"
                            class="ml-4"
                        >
                            <b-input
                                v-model.number="observation.config[NotificationType.ClaimableRewards].threshold"
                            />
                            <p class="control">
                                <span class="button is-disabled">PHA</span>
                            </p>
                        </UiValidatedField>
                    </div>
                </div>

                <div
                    class="columns"
                >
                    <div class="column is-2">
                        <UiValidatedField
                            name="Active"
                        >
                            <b-switch
                                v-model="observation.config[NotificationType.RewardsDrop].active"
                            />
                        </UiValidatedField>
                    </div>
                    <div class="column is-4">
                        Rewards decreased
                    </div>
                    <div class="column is-6 is-flex is-flow-direction-row">
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

                        <UiValidatedField
                            name="Threshold"
                            :rules="{ required: true, integer: true, min_value: 0, max_value: 100 }"
                            class="ml-4"
                        >
                            <b-input
                                v-model.number="observation.config[NotificationType.RewardsDrop].threshold"
                            />
                            <p class="control">
                                <span class="button is-disabled">%</span>
                            </p>
                        </UiValidatedField>
                    </div>
                </div>

            </ValidationObserver>
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
            .getCollection(new Api.Domain.CollectionRequest({
                filters: {
                    onChainId: { $like: `%${term}%` },
                }
            }));

        return collection.items;
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

<style lang="scss">
.is-row-disabled {
    pointer-events: none;
    opacity: 0.6;
}
</style>
