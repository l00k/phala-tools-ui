<template>
    <div>
        <div class="panel is-primary">
            <header class="panel-heading">
                <div class="panel-heading-title is-justify-content-space-between">
                    <span>Observations</span>
                </div>
            </header>
            <div class="panel-block">
                <div class="is-flex is-justify-content-end mb-2">
                    <b-button
                        type="is-success"
                        size="is-small"
                        class="mb-2"
                        @click="doCreate()"
                    >Create new</b-button>
                </div>

                <div
                    v-if="user.observations?.length > 0"
                >

                    <div
                        v-for="observation in user.observations"
                        :key="observation.id"
                        class="box mb-2"
                    >
                        <h2 class="title is-6 mb-2">StakePool #{{ observation.stakePool.onChainId }}</h2>
                        <div class="columns">
                            <div class="column">
                                <div class="mb-3">
                                    <b-tag
                                        :type="observation.mode == ObservationMode.Owner ? 'is-success' : 'is-warning'"
                                    >Observe as {{ observation.mode.toUpperCase() }}</b-tag>

                                    <div
                                        v-if="observation.mode == ObservationMode.Delegator"
                                        class="mt-2"
                                    >
                                        <div
                                            v-if="observation.account"
                                            class="is-flex is-flex-direction-row is-align-items-center"
                                        >
                                            <Identicon
                                                :size="32"
                                                theme="substrate"
                                                :value="observation.account.address"
                                            />
                                            <span class="ml-4">{{ observation.account.address }}</span>
                                        </div>
                                        <div
                                            v-else
                                            class="has-color-red"
                                        >
                                            Account not specified! Not all watchers are available.
                                        </div>
                                    </div>

                                </div>
                                <div>
                                    <div
                                        class="has-text-weight-bold has-color-gray"
                                    >Last notifications</div>
                                    <ul v-if="getLastNotifications(observation).length > 0">
                                        <li
                                            v-for="notification in getLastNotifications(observation)"
                                        >
                                            <span class="has-color-gray">{{ notification.time | formatDatetime }}</span>
                                            <span class="ml-4">{{ notification.type }}</span>
                                        </li>
                                    </ul>
                                    <div v-else>
                                        Nothing yet.
                                    </div>
                                </div>
                            </div>
                            <div class="column is-narrow is-flex is-flex-direction-column">
                                <b-button
                                    type="is-info"
                                    size="is-small"
                                    class="mb-2"
                                    @click="doEdit(observation)"
                                >Edit</b-button>
                                <b-button
                                    type="is-danger"
                                    size="is-small"
                                    @click="doDelete(observation)"
                                >Delete</b-button>
                            </div>
                        </div>
                    </div>

                </div>
                <div
                    v-else
                    class="is-flex is-justify-content-center is-align-items-center p-6 has-color-gray"
                >
                    <b-icon
                        pack="fas"
                        icon="heart-broken"
                        size="is-small"
                        class="mr-2"
                    />

                    Nothing here.
                </div>

            </div>
        </div>

        <UiModal
            ref="observationFormModal"
            :confirm-cancel="isObservationModified"
        >
            <ObservationForm
                ref="observationForm"
                @change="isObservationModified = true"
                @submit:success="onSubmitSuccess"
            />
        </UiModal>

    </div>
</template>

<script lang="ts">
import { BaseComponent, UiModal } from '#/FrontendCore/Component';
import { Component } from '#/FrontendCore/Vue/Annotations';
import { MessagingChannel } from '#/Watchdog/Domain/Model/MessagingChannel';
import { Observation, ObservationMode } from '#/Watchdog/Domain/Model/Observation';
import { NotificationType } from '#/Watchdog/Domain/Model/Observation/ObservationNotifications';
import { User } from '#/Watchdog/Domain/Model/User';
import { ObservationService } from '#/Watchdog/Domain/Service/ObservationService';
import * as Api from '@inti5/api-frontend';
import { Annotation as API } from '@inti5/api-frontend';
import startCase from 'lodash/startCase';
import { Ref } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import ObservationForm, { FormMode } from './Observation/ObservationForm.vue';

const RuntimeStorage = namespace('Watchdog/RuntimeStorage');


type Notification = {
    type : string,
    date : Date,
}

@Component({
    components: {
        ObservationForm,
    }
})
export default class WatchdogConfiguration
    extends BaseComponent
{

    @API.InjectClient()
    protected _apiClient : Api.Client;

    protected _observationService : ObservationService;


    public MessagingChannel = MessagingChannel;
    public ObservationMode = ObservationMode;

    @RuntimeStorage.State('user')
    public user : User;

    @Ref('observationFormModal')
    public observationEditModal : UiModal;

    @Ref('observationForm')
    public observationForm : ObservationForm;


    public isObservationModified : boolean = false;


    public getLastNotifications(observation : Observation) : Notification[]
    {
        const notificationTypes = Object.values(NotificationType);
        return Object.entries(observation.lastNotifications)
            .filter(([ type, time ]) => time > 0)
            .filter(([ type, time ]) => notificationTypes.includes(<any>type))
            .map(([ type, time ]) => ({
                type: startCase(type),
                date: new Date(time * 1000),
            }))
            .sort((a,b) => a.date < b.date ? -1 : 1);
    }

    public mounted()
    {
        this._observationService = this._apiClient.getService(ObservationService);
    }

    public doCreate()
    {
        this.isObservationModified = false;
        this.observationEditModal.show();
        this.$nextTick(() => this.observationForm.setupCreateForm());
    }

    public doEdit(observation : Observation)
    {
        this.isObservationModified = false;
        this.observationEditModal.show();
        this.$nextTick(() => this.observationForm.setupEditForm(observation));
    }

    public async doDelete(observation : Observation)
    {
        const confirmed = await this.confirm({
            type: 'is-danger',
            title: 'Confirm delete',
            message: `Confirm deleting stake pool observation #${observation.stakePool.onChainId}`,
        });
        if (!confirmed) {
            return;
        }

        try {
            const result = await this._observationService.delete(observation);

            if (result) {
                // remove from list
                this.user.observations = this.user.observations
                    .filter(_observation => _observation.id !== observation.id);

                this.showNotification({
                    type: 'is-success',
                    message: 'Observation deleted',
                });
            }
            else {
                this.showNotification({
                    type: 'is-danger',
                    message: 'Could not delete observation',
                });
            }
        }
        catch (e : any) {
            this.showNotification({
                type: 'is-danger',
                message: e.message + ' #' + e.code,
            });
        }
    }

    public async onSubmitSuccess(
        observation : Observation,
        formMode : FormMode,
    )
    {
        this.isObservationModified = false;

        console.dir(observation);

        if (formMode === FormMode.Create) {
            this.user.observations.push(observation);
        }
        else if (formMode === FormMode.Edit) {
            const findExisting = this.user.observations.findIndex(_observation => _observation.id === observation.id);
            console.log(findExisting);
            this.$set(this.user.observations, findExisting, observation);
        }

        setTimeout(() => {
            this.observationEditModal.hide();
        }, 1000);
    }

}
</script>
