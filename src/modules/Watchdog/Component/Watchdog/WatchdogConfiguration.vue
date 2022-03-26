<template>
    <div>
        <div class="panel is-primary">
            <header class="panel-heading">
                <div class="panel-heading-title is-justify-content-space-between">
                    <span>Global Configuration</span>
                </div>
            </header>
            <div class="panel-block">

            </div>
        </div>

        <div class="panel is-primary">
            <header class="panel-heading">
                <div class="panel-heading-title is-justify-content-space-between">
                    <span>Observations</span>
                </div>
            </header>
            <div class="panel-block">

                <div
                    v-for="observation in user.stakePoolObservations"
                    :key="observation.id"
                    class="box"
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
                                    class="mt-2 is-flex is-flex-direction-row is-align-items-center"
                                >
                                    <Identicon
                                        :size="32"
                                        theme="substrate"
                                        :value="observation.account.address"
                                    />
                                    <span class="ml-4">{{ observation.account.address }}</span>
                                </div>

                            </div>
                            <div>
                                <div
                                    class="has-text-weight-bold has-color-gray"
                                >Last notifications</div>
                                <ul v-if="Object.entries(observation.lastNotifications).length">
                                    <li
                                        v-for="entry in Object.entries(observation.lastNotifications)"
                                    >
                                        <span class="has-color-gray">{{ entry[1] }}</span>
                                        <span>{{ entry[0] }}</span>
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
                            >Edit</b-button>
                            <b-button
                                type="is-danger"
                                size="is-small"
                            >Delete</b-button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { BaseComponent } from '#/FrontendCore/Component';
import { Component } from '#/FrontendCore/Vue/Annotations';
import { MessagingChannel } from '#/Watchdog/Domain/Model/MessagingChannel';
import { ObservationMode } from '#/Watchdog/Domain/Model/StakePoolObservation';
import { User } from '#/Watchdog/Domain/Model/User';
import * as Api from '@/core/api-frontend';
import { Annotation as API } from '@/core/api-frontend';
import { namespace } from 'vuex-class';

const RuntimeStorage = namespace('Watchdog/RuntimeStorage');


@Component()
export default class WatchdogConfiguration
    extends BaseComponent
{

    protected MessagingChannel = MessagingChannel;
    protected ObservationMode = ObservationMode;


    @API.InjectClient('watchdog')
    protected apiClient : Api.Client;

    @RuntimeStorage.State('user')
    protected user : User;


    public mounted ()
    {
    }


}
</script>
