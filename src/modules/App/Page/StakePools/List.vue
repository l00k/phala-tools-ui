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
import ListView from '#/App/Component/StakePools/ListView.vue';
import BaseComponent from '@inti5/app-frontend/Component/BaseComponent.vue';
import { Component, Route } from '@inti5/app-frontend/Vue/Annotations';


@Route('/stakepools', 'stakepools_list')
@Component({
    components: {
        ListView,
    }
})
export default class StakePoolsListPage
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
