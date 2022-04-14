<template>
    <UiModal
        :visibleOnStart="true"
        :canCancel="false"
    >
        <div class="alert is-flex is-align-items-center is-flex-direction-column">
            <h4 class="subtitle is-4"><span class="has-color-phala">Phala</span> Network mainnet is not ready yet</h4>
            <h2 class="title is-2">Please switch to <span class="has-color-khala">Khala</span></h2>
            <b-button
                @click="switchApp()"
                class="has-color-khala"
            >
                Switch to Khala
            </b-button>
        </div>
    </UiModal>
</template>

<script lang="ts">
import BaseComponent from '#/FrontendCore/Component/BaseComponent.vue';
import { Component } from '#/FrontendCore/Vue/Annotations';

declare const window;

@Component()
export default class MainnetNotReady
    extends BaseComponent
{

    public switchApp()
    {
        const url = 'https://khala.100k.dev/';
        location.href = url;
    }

}
</script>

<style scoped lang="scss">
.alert {

}
</style>
