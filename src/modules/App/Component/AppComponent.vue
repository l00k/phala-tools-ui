<template>
    <div id="app">
        <MainMenu />

        <keep-alive
            v-if="!isPhala"
        >
            <router-view />
        </keep-alive>

        <MainnetNotReady
            v-if="isPhala"
        />
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

    public get isPhala () : boolean
    {
        const appVariant = window.appData.appVariant;
        return appVariant === Network.Phala;
    }

}
</script>

<style lang="scss" src="@/assets/scss/app.scss" />
