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
import BaseComponent from '#/AppFrontend/Component/BaseComponent.vue';
import { Component, Route } from '#/AppFrontend/Vue/Annotations';
import * as VueRouter from 'vue-router';


@Route('/stakepools/:id', 'stakepools_details')
@Route('/stakepools/onchain/:onChainId', 'stakepools_details2')
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

        this.requestedId = this.getRequestedId(this.$route);
    }

    public async beforeRouteEnter (to : VueRouter.Route, from : VueRouter.Route, next : VueRouter.NavigationGuardNext<any>)
    {
        next((component : StakePoolsDetailsPage) => {
            component.requestedId = component.getRequestedId(to);
        });
    }

    public async beforeRouteUpdate (to : VueRouter.Route, from : VueRouter.Route, next : VueRouter.NavigationGuardNext<any>)
    {
        this.requestedId = this.getRequestedId(to);
        next();
    }

    protected getRequestedId(route : VueRouter.Route) : number
    {
        return route.params.onChainId
            ? Number(route.params.onChainId) + 3
            : Number(route.params.id);
    }

}
</script>
