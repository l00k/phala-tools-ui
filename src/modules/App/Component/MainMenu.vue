<template>
    <div
        class="g-mainmenu tabs is-toggle"
    >
        <div class="mr-5 is-flex is-justify-content-center is-flex-direction-column page-title">
            <div>
                <span class="has-color-primary">{{ appName }}</span> Network
            </div>
            <div class="has-text-weight-bold">tools</div>
        </div>

        <ul>
            <router-link
                to="/mining-calc"
                exact custom
                v-slot="{ navigate, isActive }"
            >
                <li
                    :class="{ 'is-active': isActive }"
                    @click="navigate"
                >
                    <a>
                        <span class="icon is-small"><i class="fas fa-chart-column" aria-hidden="true"></i></span>
                        <span>Mining calculator</span>
                    </a>
                </li>
            </router-link>

            <router-link
                to="/watchdog"
                exact custom
                v-slot="{ navigate, isActive }"
            >
                <li
                    :class="{ 'is-active': isActive }"
                    @click="navigate"
                >
                    <a>
                        <span class="icon is-small"><i class="fas fa-tower-observation" aria-hidden="true"></i></span>
                        <span>Watchdog</span>
                    </a>
                </li>
            </router-link>
        </ul>

        <b-field
            label="Switch network"
            label-position="on-border"
            class="network-selector"
        >
            <b-dropdown
                :value="appVariant"
                position="is-bottom-left"
                class="ml-4"
                @input="changeApp"
            >
                <template #trigger="{ active }">
                    <b-button
                        type="is-primary"
                        :icon-right="active ? 'caret-up' : 'caret-down'"
                    >
                        {{ appName }}
                    </b-button>
                </template>

                <b-dropdown-item
                    v-if="appVariant !== Network.Phala"
                    :value="Network.Phala"
                    class="is-flex is-justify-content-space-between"
                >
                    <span class="has-color-phala">Phala</span>
                    <span class="has-color-gray">(on Polkadot)</span>
                </b-dropdown-item>
                <b-dropdown-item
                    v-if="appVariant !== Network.Khala"
                    :value="Network.Khala"
                    class="is-flex is-justify-content-space-between"
                >
                    <span class="has-color-khala">Khala</span>
                    <span class="has-color-gray">(on Kusama)</span>
                </b-dropdown-item>
            </b-dropdown>
        </b-field>
    </div>
</template>

<script lang="ts">
import { Network } from '#/App/Domain/Type/Network';
import { Component } from '#/FrontendCore/Vue/Annotations';
import BaseComponent from '#/FrontendCore/Component/BaseComponent.vue';

declare const window;

@Component()
export default class MainMenu
    extends BaseComponent
{

    public Network = Network;


    public get appVariant() : Network
    {
        return window.appData.appVariant;
    }

    public get appName() : string
    {
        const appVariant = window.appData.appVariant;
        return appVariant === 'phala'
            ? 'Phala'
            : 'Khala';
    }

    public changeApp(app : Network)
    {
        const url = 'https://' + app + '.100k.dev/';
        location.href = url;
    }

}
</script>

<style scoped lang="scss">
.page-title {
    line-height: 1.1;
    text-align: right;
}

.g-mainmenu {
    overflow: visible;
}

.network-selector {
    align-self: stretch;

    .dropdown {
        height: 100%;
    }
    .button {
        height: 100%;
    }
}
</style>
