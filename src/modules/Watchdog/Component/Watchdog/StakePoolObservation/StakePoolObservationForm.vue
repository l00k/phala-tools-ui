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
import { Watch } from 'vue-property-decorator';


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
    public ObservationMode = ObservationMode;

    public observation : StakePoolObservation = new StakePoolObservation();
    public formMode : FormMode = null;

    public observationAccountAddress : string = '';


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

    @Watch('observationAccountAddress')
    public async onObservationAccountChange(address)
    {
        if (address) {
            // try to load account
            console.log(address);
            this.observation.account = await this._accountService.findAccount(address);
        }
        else {
            this.observation.account = null;
            return;
        }
    }

}
</script>
