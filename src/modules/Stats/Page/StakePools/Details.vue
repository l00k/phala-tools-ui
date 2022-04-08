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
                :stake-pool-entry-id="requestedId"
            />
        </div>
    </div>
</template>

<script lang="ts">
import DetailsView from '#/Stats/Component/StakePools/DetailsView.vue';
import BaseComponent from '#/FrontendCore/Component/BaseComponent.vue';
import { Component, Route } from '#/FrontendCore/Vue/Annotations';
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

        this.requestedId = this._getRequestedId(this.$route);
    }

    public async beforeRouteEnter (to : VueRouter.Route, from : VueRouter.Route, next : VueRouter.NavigationGuardNext<any>)
    {
        next((component : StakePoolsDetailsPage) => {
            component.requestedId = component._getRequestedId(to);
        });
    }

    public async beforeRouteUpdate (to : VueRouter.Route, from : VueRouter.Route, next : VueRouter.NavigationGuardNext<any>)
    {
        this.requestedId = this._getRequestedId(to);
        next();
    }

    protected _getRequestedId(route : VueRouter.Route) : number
    {
        const requestedId = Number(route.params.id ?? route.params.onChainId) + 3;
        return requestedId;
    }

}
</script>
