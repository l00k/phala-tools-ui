<template>
    <div
        class="g-mainmenu tabs is-toggle"
    >
        <ul>
            <router-link
                to="/stakepools"
                custom v-slot="{ navigate, isActive }"
            >
                <li
                    :class="{ 'is-active': isActive }"
                    @click="navigate"
                >
                    <a>
                        <span class="icon is-small"><i class="fas fa-swimming-pool" aria-hidden="true"></i></span>
                        <span>StakePools</span>
                    </a>
                </li>
            </router-link>
            <router-link
                to="/network-map"
                custom v-slot="{ navigate, isActive }"
            >
                <li
                    :class="{ 'is-active': isActive }"
                    @click="navigate"
                >
                    <a>
                        <span class="icon is-small"><i class="fas fa-project-diagram" aria-hidden="true"></i></span>
                        <span>Network map</span>
                    </a>
                </li>
            </router-link>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component } from '@inti5/app-frontend/Vue/Annotations';
import BaseComponent from '@inti5/app-frontend/Vue/BaseComponent.vue';


@Component()
export default class MainMenuView
    extends BaseComponent
{
}
</script>
