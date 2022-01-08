<template>
    <div class="card mb-4 holdings-view">
        <header class="card-header">
            <div class="card-header-title is-justify-content-space-between">
                <span>Stake pools</span>
                <span></span>
            </div>
        </header>
        <div class="card-content">

            <ui-table
                :data="stakePools"
                :loading="isLoading"
                :detailed="true"
                detail-key="id"
                :debounce-search="1000"
                :pagination.sync="pagination"
                ref="list"
            >
                <template slot-scope="{ row: stakePool }">
                    <ui-table-column
                        label="ID"
                        :numeric="true"
                        :filter-type="FilterType.Range"
                        :filter.sync="filters.onChainId"
                        :dom-style="{ width: '120px' }"
                    >
                        #{{ stakePool.onChainId }}
                    </ui-table-column>
                </template>
            </ui-table>

        </div>
    </div>
</template>

<script lang="ts">
import { StakePool } from '#/Analyze/Domain/Definition';
import { Inject } from '@inti5/object-manager';
import { FilterType } from '@inti5/app-frontend/Domain';
import BaseComponent from '@inti5/app-frontend/Component/BaseComponent.vue';
import { Component } from '@inti5/app-frontend/Vue/Annotations';
import { namespace } from 'vuex-class';


const RuntimeStorage = namespace('StakePools/RuntimeStorage');


@Component({
    components: {}
})
export default class ListView
    extends BaseComponent
{

    @Inject()
    protected

    protected FilterType = FilterType;

    protected isLoading : boolean = false;
    protected stakePools : StakePool[] = [];


    public mounted()
    {
        this.stakePools =
    }

}
</script>

<style lang="scss">
@import "@/assets/scss/theme/_variables";
</style>
