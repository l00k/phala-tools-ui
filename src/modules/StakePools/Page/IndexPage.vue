<template>
    <div class="g-page">
        <b-loading
            :is-full-page="false"
            :active="!isReady"
            class="m-loading"
        />

        <div
            v-if="isReady"
            class="g-container g-container--default"
        >
            <ListView />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Route } from '@/intiv/core/Vue/Annotations';
import BaseComponent from '@/intiv/core/Vue/BaseComponent.vue';
import { namespace } from 'vuex-class';
import ListView from '#/StakePools/Component/ListView.vue';


const Storage = namespace('StakePools/Storage');

@Route('/stakepools', 'stakepools')
@Component({
    components: {
        ListView,
    }
})
export default class IndexPage
    extends BaseComponent
{

    public isReady : boolean = false;


    public async mounted ()
    {
        await this.$store.dispatch('StakePools/Storage/init');
        this.isReady = true;
    }

}
</script>

<style lang="scss">
.m-loading {
    z-index: 10;
}
</style>
