<template>
    <div id="app">
        <MainMenu />

        <keep-alive>
            <router-view />
        </keep-alive>
    </div>
</template>

<script lang="ts">
import MainMenu from '#/App/Component/MainMenu.vue';
import MainnetNotReady from '#/App/Component/MainnetNotReady.vue';
import { Network } from '#/App/Domain/Type/Network';
import BaseComponent from '#/FrontendCore/Component/BaseComponent.vue';
import { Component } from 'vue-property-decorator';

declare const window;

@Component({
    components: {
        MainMenu,
        MainnetNotReady
    }
})
export default class AppComponent
    extends BaseComponent
{
}
</script>

<style lang="scss" src="@/assets/scss/app.scss" />
