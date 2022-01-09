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
                :backend="true"
                :collection-request="collectionRequest"
                ref="list"
            >
                <template #default="{ row: stakePool }">
                    <ui-table-column
                        label="ID"
                        :numeric="true"
                        :filter-type="FilterType.Range"
                        :filter-paths="[ 'onChainId' ]"
                    >
                        #{{ stakePool.onChainId }}
                    </ui-table-column>

                    <ui-table-column
                        label="Owner"
                        :filter-paths="[ '$or.0.owner.address', '$or.1.owner.identity', '$or.2.owner.alias' ]"
                    >
                        <div class="has-font-size-sm">
                            <a
                                :href="stakePool.owner | getSubscanAccountUrl"
                                class="has-color-gray"
                                target="_blank"
                            >{{ stakePool.owner.address | formatAddress }}</a>
                        </div>
                        <div :class="{ 'has-color-primary': stakePool.owner.identityVerified }">
                            <b-icon
                                v-if="stakePool.owner.identityVerified"
                                pack="fas"
                                icon="check-square"
                                size="is-small"
                                class="is-valign-middle"
                                v-tooltip="'Identity judgement'"
                            />
                            {{ stakePool.owner.friendlyName }}
                        </div>
                    </ui-table-column>

                    <ui-table-column
                        label="APR"
                        :numeric="true"
                    >
                        <div>Avg: {{ stakePool.lastHistoryEntry.avgApr | formatNumber('0.0%') }}</div>
                        <div class="has-font-size-sm has-color-gray">
                            Current: {{ stakePool.lastHistoryEntry.currentApr | formatNumber('0.0%') }}
                        </div>
                    </ui-table-column>

                    <ui-table-column
                        label="Stake"
                        :numeric="true"
                    >
                        <div>{{ stakePool.lastHistoryEntry.stakeTotal | formatCoin({ mantissa: 0 }) }}</div>
                        <div class="has-font-size-sm has-color-gray">
                            Free: {{ stakePool.lastHistoryEntry.stakeFree | formatCoin({ mantissa: 0 }) }}<br/>
                            Releasing: {{ stakePool.lastHistoryEntry.stakeReleasing | formatCoin({ mantissa: 0 }) }}<br/>
                        </div>
                    </ui-table-column>
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
import Vue from 'vue';
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
            onChainId: {},
            $or: [
                { owner: { address: {} } },
                { owner: { identity: {} } },
                { owner: { alias: {} } },
            ],
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
