<template>
    <div
        class="g-mainmenu tabs is-toggle"
    >
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

<!--            <router-link-->
<!--                to="/network-map"-->
<!--                custom v-slot="{ navigate, isActive }"-->
<!--            >-->
<!--                <li-->
<!--                    :class="{ 'is-active': isActive }"-->
<!--                    @click="navigate"-->
<!--                >-->
<!--                    <a>-->
<!--                        <span class="icon is-small"><i class="fas fa-project-diagram" aria-hidden="true"></i></span>-->
<!--                        <span>Network map</span>-->
<!--                    </a>-->
<!--                </li>-->
<!--            </router-link>-->
        </ul>
    </div>
</template>

<script lang="ts">
import { Component } from '#/FrontendCore/Vue/Annotations';
import BaseComponent from '#/FrontendCore/Component/BaseComponent.vue';

@Component()
export default class MainMenuView
    extends BaseComponent
{
}
</script>
