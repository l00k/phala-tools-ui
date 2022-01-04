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
import { TagService } from '#/App/Domain/Service/TagService';
import { Inject } from '@inti5/object-manager';
import { Component, Route } from '@inti5/app-frontend/Vue/Annotations';
import BaseComponent from '@inti5/app-frontend/Component/BaseComponent.vue';
import ListView from '#/App/Component/StakePools/ListView.vue';


@Route('/stakepools', 'stakepools')
@Component({
    components: {
        ListView,
    }
})
export default class StakePoolsIndexPage
    extends BaseComponent
{

    public isReady : boolean = false;

    public async mounted ()
    {
        await this.$store.dispatch('StakePools/RuntimeStorage/init');
        this.isReady = true;
    }

}
</script>

<style lang="scss">
.m-loading {
    z-index: 10;
}
</style>
