<template>
    <div id="app">
        <MainMenuView />

        <keep-alive>
            <router-view />
        </keep-alive>
    </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import MainMenuView from '#/App/Component/MainMenuView.vue';
import BaseComponent from '@/intiv/core/Vue/BaseComponent.vue';

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
