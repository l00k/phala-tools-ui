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
                :debounce-search="1000"
                :backend-pagination="true"
                :pagination.sync="collectionRequest.pagination"
                ref="list"
            >
                <template slot="default">
                    <b-table-column
                        v-slot="{ row: stakePool }"
                        label="ID"
                        :numeric="true"
                        :filter-type="FilterType.Range"
                        :filter.sync="collectionRequest.filters.onChainId"
                        :dom-style="{ width: '120px' }"
                    >
                        #{{ stakePool.onChainId }}
                    </b-table-column>
                </template>
            </ui-table>

        </div>
    </div>
</template>

<script lang="ts">
import { StakePool } from '#/App/Domain/Model/StakePool';
import { StakePoolService } from '#/App/Domain/Service/StakePoolService';
import * as Api from '@inti5/api-frontend';
import BaseComponent from '@inti5/app-frontend/Component/BaseComponent.vue';
import { FilterType } from '@inti5/app-frontend/Domain';
import { Component } from '@inti5/app-frontend/Vue/Annotations';
import { Inject } from '@inti5/object-manager';
import { Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';


const RuntimeStorage = namespace('StakePools/RuntimeStorage');


@Component({
    components: {}
})
export default class ListView
    extends BaseComponent
{

    @Inject()
    protected stakePoolService : StakePoolService;

    protected FilterType = FilterType;

    protected collectionRequest : Api.Domain.CollectionRequest<StakePool> = new Api.Domain.CollectionRequest({
        filters: {
            onChainId: {}
        },
        pagination: StakePoolService.getDefaultPagination()
    });

    protected isLoading : boolean = false;
    protected stakePools : StakePool[] = [];


    public mounted ()
    {
        this.loadStakePools();
    }

    @Watch('collectionRequest', { deep: true })
    protected async loadStakePools ()
    {
        this.isLoading = true;

        const collection = await this.stakePoolService.getCollection(this.collectionRequest);

        this.stakePools = collection.items;
        this.collectionRequest.pagination.total = collection.total;

        this.isLoading = false;
    }


}
</script>

<style lang="scss">
@import "@/assets/scss/theme/_variables";
</style>
