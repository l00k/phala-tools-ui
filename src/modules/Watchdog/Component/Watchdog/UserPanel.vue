<template>
    <div class="g-menu-secondary is-flex is-align-items-start">
        <div class="tabs is-toggle">
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

        <div
            v-if="user.msgChannel == MessagingChannel.Discord"
            class="tabs is-toggle ml-4"
        >
            <ul>
                <li>
                    <a
                        :href="discordConfig.serverInviteLink"
                        target="_blank"
                        class="button is-discord server-link is-flex"
                    >
                        <div>Join server / To allow bot messaging!</div>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import BaseComponent from '#/FrontendCore/Component/BaseComponent.vue';
import { Component } from '#/FrontendCore/Vue/Annotations';
import { User } from '#/Watchdog/Domain/Model/User';
import { Config } from '@inti5/configuration';
import * as Api from '@inti5/api-frontend';
import { API } from '@inti5/api-frontend';
import { namespace } from 'vuex-class';
import { MessagingChannel } from '#/Watchdog/Domain/Model/MessagingChannel';

const RuntimeStorage = namespace('Watchdog/RuntimeStorage');


@Component()
export default class UserPanel
    extends BaseComponent
{

    @API.InjectClient()
    protected _apiClient : Api.Client;

    @Config('modules.watchdog.discord')
    public discordConfig;


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

<style scoped lang="scss">
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

.button.is-discord {
    background: #5865F2;
    height: auto;

    &.server-link {
        flex-grow: 1;
    }

    &:focus:not(:active),
    &.is-focused:not(:active) {
        color: #fff;
        box-shadow: 0 0 0 0.125em rgb(255 255 255 / 25%)
    }
}
</style>
