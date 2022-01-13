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
            <h1>ok</h1>
        </div>
    </div>
</template>

<script lang="ts">
import { StakePool } from '#/App/Domain/Model/StakePool';
import { StakePoolService } from '#/App/Domain/Service/StakePoolService';
import { Inject } from '@/core/inti5/object-manager';
import BaseComponent from '@inti5/app-frontend/Component/BaseComponent.vue';
import { Component, Route } from '@inti5/app-frontend/Vue/Annotations';
import * as VueRouter from 'vue-router';


@Route('/stakepools/:id', 'stakepools_details')
@Component()
export default class StakePoolsDetailsPage
    extends BaseComponent
{

    @Inject()
    protected stakePoolService : StakePoolService;

    public isReady : boolean = false;

    public stakePool : StakePool;


    public async beforeRouteEnter(to : VueRouter.Route, from : VueRouter.Route, next : VueRouter.NavigationGuardNext<any>)
    {
        next(async (component : StakePoolsDetailsPage) => {
            component.isReady = false;

            const requestedId = to.params.id;

            await component.$store.dispatch('StakePools/RuntimeStorage/init');
            component.stakePool = await component.stakePoolService.getItem(requestedId);

            component.isReady = true;
        });
    }

}
</script>

<style lang="scss">
.m-loading {
    z-index: 10;
}
</style>
