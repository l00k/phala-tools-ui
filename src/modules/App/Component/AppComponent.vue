<template>
    <div id="app">
        <MainMenuView />

        <keep-alive>
            <router-view />
        </keep-alive>
    </div>
</template>

<script lang="ts">
import MainMenuView from '#/App/Component/MainMenuView.vue';
import BaseComponent from '#/FrontendCore/Component/BaseComponent.vue';
import { Component } from 'vue-property-decorator';

@Component({
    components: {
        MainMenuView
    }
})
export default class AppComponent
    extends BaseComponent
{
}
</script>

<style lang="scss" src="@/assets/scss/app.scss" />
