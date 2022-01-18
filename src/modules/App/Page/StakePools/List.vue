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

            <v-tour
                :name="tourName"
                :steps="tourSteps"
                :callbacks="{ onFinish: onTourFinish }"
            />
        </div>
    </div>
</template>

<script lang="ts">
import ListView from '#/App/Component/StakePools/ListView.vue';
import BaseComponent from '@inti5/app-frontend/Component/BaseComponent.vue';
import { Component, Route } from '@inti5/app-frontend/Vue/Annotations';
import { namespace } from 'vuex-class';


const ClientStore = namespace('App/Client');


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

    public tourName : string = 'stakepools_list';

    @ClientStore.State('finishedTours')
    public finishedTours : string[];

    public tourSteps = [
        {
            target: 'thead tr:nth-child(2) th:nth-child(5)',
            header: {
                title: 'Filters',
            },
            content: `Default filter is set to limit displayment of full stake pools`,
            params: {
                placement: 'top',
                enableScrolling: false,
            }
        },
        {
            target: 'thead th.is-sortable:nth-child(4)',
            header: {
                title: 'Sorting',
            },
            content: `Your can sort though multiple columns`,
            params: {
                placement: 'top',
                enableScrolling: false,
            }
        },
        {
            target: '.ui-table tbody tr:nth-child(2) td:nth-child(3)',
            header: {
                title: 'Show details',
            },
            content: `Click on any row to display stake pool details`,
            params: {
                placement: 'bottom',
                enableScrolling: false,
            }
        },
    ];

    public async mounted ()
    {
        await this.$store.dispatch('StakePools/RuntimeStorage/init');
        this.isReady = true;

        setTimeout(() => {
            if (!this.finishedTours.includes(this.tourName)) {
                this.$tours[this.tourName].start();
            }
        }, 1000);
    }

    public onTourFinish()
    {
        this.$store.commit('App/Client/finishTour', this.tourName);
    }

}
</script>
