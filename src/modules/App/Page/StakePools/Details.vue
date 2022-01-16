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
            <DetailsView
                :stakePoolId="requestedId"
            />
        </div>
    </div>
</template>

<script lang="ts">
import DetailsView from '#/App/Component/StakePools/DetailsView.vue';
import BaseComponent from '@inti5/app-frontend/Component/BaseComponent.vue';
import { Component, Route } from '@inti5/app-frontend/Vue/Annotations';
import * as VueRouter from 'vue-router';


@Route('/stakepools/:id', 'stakepools_details')
@Component({
    components: {
        DetailsView
    }
})
export default class StakePoolsDetailsPage
    extends BaseComponent
{

    public isReady : boolean = false;

    public requestedId : number = null;


    public async mounted ()
    {
        await this.$store.dispatch('StakePools/RuntimeStorage/init');
        this.isReady = true;

        this.requestedId = Number(this.$route.params.id);
    }

    public async beforeRouteEnter (to : VueRouter.Route, from : VueRouter.Route, next : VueRouter.NavigationGuardNext<any>)
    {
        next((component : StakePoolsDetailsPage) => {
            component.requestedId = Number(to.params.id);
        });
    }

    public async beforeRouteUpdate (to : VueRouter.Route, from : VueRouter.Route, next : VueRouter.NavigationGuardNext<any>)
    {
        this.requestedId = Number(to.params.id);
        next();
    }

}
</script>
