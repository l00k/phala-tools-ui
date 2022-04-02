<template>
    <div
        class="g-menu-secondary tabs is-toggle"
    >
        <ul>
            <li>
                <a
                    class="user-badge"
                    :class="{
                        'is-discord': user.msgChannel == MessagingChannel.Discord,
                        'is-telegram': user.msgChannel == MessagingChannel.Telegram,
                    }"
                >
                    <span class="icon is-small">
                        <i
                            class="fab"
                            :class="{
                                'fa-discord': user.msgChannel == MessagingChannel.Discord,
                                'fa-telegram': user.msgChannel == MessagingChannel.Telegram,
                            }"
                        ></i>
                    </span>
                    <span>{{ user.username }}</span>
                </a>
            </li>
            <li>
                <a @click="doLogout">
                    <span>Logout</span>
                </a>
            </li>

        </ul>
    </div>
</template>

<script lang="ts">
import BaseComponent from '#/FrontendCore/Component/BaseComponent.vue';
import { Component } from '#/FrontendCore/Vue/Annotations';
import { User } from '#/Watchdog/Domain/Model/User';
import * as Api from '@/core/api-frontend';
import { Annotation as API } from '@/core/api-frontend';
import { namespace } from 'vuex-class';
import { MessagingChannel } from '#/Watchdog/Domain/Model/MessagingChannel';

const RuntimeStorage = namespace('Watchdog/RuntimeStorage');


@Component()
export default class UserPanel
    extends BaseComponent
{

    @API.InjectClient()
    protected _apiClient : Api.Client;


    public MessagingChannel = MessagingChannel;

    @RuntimeStorage.State('user')
    public user : User;


    public doLogout()
    {
        this._apiClient.clearTokens();
        location.reload();
    }

}
</script>

<style lang="scss">
.user-badge {
    cursor: default;
    pointer-events: none;

    &.is-telegram {
        background: #28A0D3;
    }
    &.is-discord {
        background: #5865F2;
    }
}
</style>
