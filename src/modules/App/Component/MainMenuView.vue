<template>
    <div
        class="g-mainmenu tabs is-toggle"
    >
        <div class="mr-5 is-flex is-justify-content-end is-flex-direction-column page-title">
            <div>
                <span class="has-color-primary">{{ appName }}</span> Network
            </div>
            <div class="has-text-weight-bold">tools</div>
        </div>

        <ul>
            <router-link
                to="/stakepools"
                custom
                v-slot="{ navigate, isActive }"
            >
                <li
                    :class="{ 'is-active': isActive }"
                    @click="navigate"
                >
                    <a>
                        <span class="icon is-small"><i class="fas fa-users" aria-hidden="true"></i></span>
                        <span>StakePools</span>
                    </a>
                </li>
            </router-link>

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
    </div>
</template>

<script lang="ts">
import { Component } from '#/FrontendCore/Vue/Annotations';
import BaseComponent from '#/FrontendCore/Component/BaseComponent.vue';

declare const window;

@Component()
export default class MainMenuView
    extends BaseComponent
{

    public get appName() : string
    {
        const appVariant = window.appData.appVariant;
        return appVariant === 'phala'
            ? 'Phala'
            : 'Khala';
    }

}
</script>

<style scoped lang="scss">
.page-title {
    line-height: 1.1;
    text-align: right;
}
</style>
