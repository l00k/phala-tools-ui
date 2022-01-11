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
                :sorting.sync="collectionRequest.sorting"
                :sort-multiple="true"
                :default-sort="[ 'lastHistoryEntry.avgApr', 'desc' ]"
                :backend="true"
                :pagination="collectionRequest.pagination"
                ref="list"
            >
                <template #default="{ row: stakePool }">
                    <ui-table-column
                        label="ID"
                        field="onChainId"
                        :numeric="true"
                        :sortable="true"
                        :filter="collectionRequest.filters.onChainId"
                    >
                        #{{ stakePool.onChainId }}
                    </ui-table-column>

                    <ui-table-column
                        label="Owner"
                        field="owner.identityVerified"
                        :sortable="true"
                        :filter="collectionRequest.filters._owner"
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
                        field="lastHistoryEntry.avgApr"
                        :numeric="true"
                        :sortable="true"
                        :filter="collectionRequest.filters.lastHistoryEntry.avgApr"
                    >
                        <div v-if="stakePool.lastHistoryEntry">
                            <div>Avg: {{ stakePool.lastHistoryEntry.avgApr | formatPercent }}</div>
                            <div class="has-font-size-sm has-color-gray">
                                Current: {{ stakePool.lastHistoryEntry.currentApr | formatPercent }}
                            </div>
                        </div>
                        <div v-else>
                            <div class="has-color-gray">Not calculated yet</div>
                        </div>
                    </ui-table-column>

                    <ui-table-column
                        label="Stake"
                        field="lastHistoryEntry.stakeTotal"
                        :numeric="true"
                        :sortable="true"
                        :filter="collectionRequest.filters.lastHistoryEntry.stakeTotal"
                    >
                        <div v-if="stakePool.lastHistoryEntry">
                            <div>{{ stakePool.lastHistoryEntry.stakeTotal | formatCoin('0,0') }}</div>
                            <div class="has-font-size-sm has-color-gray">
                                <div :class="{ 'has-color-red': stakePool.lastHistoryEntry.stakeFreeIssue }">
                                    Free:
                                    {{ stakePool.lastHistoryEntry.stakeFree | formatCoin('0,0') }}
                                    ({{ stakePool.lastHistoryEntry.stakeFreePercent | formatPercent }})
                                    <b-icon
                                        v-if="stakePool.lastHistoryEntry.stakeFreeIssue"
                                        pack="fas"
                                        icon="exclamation-triangle"
                                        size="is-small"
                                        class="is-valign-middle"
                                        v-tooltip="'Large amount of free stake implies leeching or abandon pool'"
                                    />
                                </div>
                                <div :class="{ 'has-color-red': stakePool.lastHistoryEntry.stakeReleasingIssue }">
                                    Releasing: {{ stakePool.lastHistoryEntry.stakeReleasing | formatCoin('0,0') }}
                                    ({{ stakePool.lastHistoryEntry.stakeReleasingPercent | formatPercent }})
                                    <b-icon
                                        v-if="stakePool.lastHistoryEntry.stakeReleasingIssue"
                                        pack="fas"
                                        icon="exclamation-triangle"
                                        size="is-small"
                                        class="is-valign-middle"
                                        v-tooltip="'Large amount of releasing stake MAY implie stake some pool issue or abandon pool'"
                                    />
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <div class="has-color-gray">Not calculated yet</div>
                        </div>
                    </ui-table-column>

                    <ui-table-column
                        label="Issues"
                    >
                        <b-tag type="is-primary">Ok</b-tag>
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
            _owner: {},
            lastHistoryEntry: {
                avgApr: {},
                stakeTotal: {},
            }
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

        console.log(this.collectionRequest.pagination.total);

        this.isLoading = false;
    }


}
</script>

<style lang="scss">
@import "@/assets/scss/theme/_variables";
</style>
