<template>
    <div class="panel is-primary mb-4">
        <header class="panel-heading">
            <div class="panel-heading-title is-justify-content-space-between">
                <span>Stake pools</span>
                <span></span>
            </div>
        </header>
        <div class="panel-block">
            <div class="list-filters mb-6 is-flex is-justify-content-start">
                <b-field class="mr-2">
                    <b-checkbox-button
                        v-model="collectionRequest.filters._identityVerified"
                        :native-value="true"
                        type="is-primary"
                        class="filter-identity-verified"
                    >
                        <b-icon icon="user-shield"></b-icon>
                        <span>Verified identity only</span>
                    </b-checkbox-button>
                </b-field>

                <b-field class="mr-2">
                    <b-checkbox-button
                        v-model="collectionRequest.filters._activeOnly"
                        :native-value="true"
                        type="is-primary"
                        class="filter-active-only"
                    >
                        <b-icon icon="chart-line"></b-icon>
                        <span>Active pools only</span>
                    </b-checkbox-button>
                </b-field>

                <b-field class="mr-2">
                    <b-checkbox-button
                        v-model="collectionRequest.filters._issues.id.$nin"
                        :native-value="1"
                        type="is-primary"
                        class="filter-exclude-bad-behaviors"
                    >
                        <b-icon icon="skull-crossbones"></b-icon>
                        <span>Exclude bad behaviors</span>
                    </b-checkbox-button>
                </b-field>

                <!--                <b-field class="mr-2">-->
                <!--                    <b-checkbox-button-->
                <!--                        v-model="collectionRequest.filters._issues.id.$nin"-->
                <!--                        :native-value="2"-->
                <!--                        type="is-primary"-->
                <!--                        class="filter-exclude-slashes"-->
                <!--                    >-->
                <!--                        <b-icon icon="skull-crossbones"></b-icon>-->
                <!--                        <span>Exclude slashed pools</span>-->
                <!--                    </b-checkbox-button>-->
                <!--                </b-field>-->

                <b-field class="mr-2">
                    <b-checkbox-button
                        v-model="collectionRequest.modifiers.distinctOwners"
                        :native-value="true"
                        type="is-primary"
                        class="filter-distinct-owners"
                    >
                        <b-icon icon="people-arrows"></b-icon>
                        <span>Distinct owners</span>
                    </b-checkbox-button>
                </b-field>
            </div>

            <ui-table
                :data="stakePools"
                :loading="isLoading"
                :sorting.sync="collectionRequest.sorting"
                :sort-multiple="true"
                :backend="true"
                :pagination="collectionRequest.pagination"
                :hoverable="true"
                ref="list"
                @click="onRowClick"
            >
                <template #actions>&nbsp;</template>

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
                        :filter-config="aprFilterConfig"
                    >
                        <template #header>
                            APR
                            <b-icon
                                pack="fas"
                                icon="question-circle"
                                size="is-small"
                                type="is-info"
                                class="is-valign-middle"
                                v-tooltip="'This column show final APR for staker (after all commissions, treasury tax etc)'"
                            />
                        </template>
                        <div v-if="stakePool.lastHistoryEntry">
                            <div>Avg: {{ stakePool.lastHistoryEntry.avgApr | formatPercent }}</div>
                            <div
                                class="has-font-size-sm"
                                :class="{
                                    'has-color-red': stakePool.lastHistoryEntry.currentApr == 0,
                                    'has-color-orange': (stakePool.lastHistoryEntry.avgApr / stakePool.lastHistoryEntry.currentApr) >= 2,
                                    'has-color-gray': (stakePool.lastHistoryEntry.avgApr / stakePool.lastHistoryEntry.currentApr) < 2,
                                }"
                            >
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
                            <div>{{ stakePool.lastHistoryEntry.stakeTotal | formatCoin({ mantissa: 0 }) }} PHA</div>
                            <div class="has-font-size-sm has-color-gray">
                                <div :class="{ 'has-color-red': stakePool.lastHistoryEntry.stakeFreeIssue }">
                                    Free:
                                    {{ stakePool.lastHistoryEntry.stakeFree | formatCoin({ mantissa: 0 }) }} PHA
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
                                <div :class="{ 'has-color-orange': stakePool.lastHistoryEntry.stakeReleasingIssue }">
                                    Releasing: {{ stakePool.lastHistoryEntry.stakeReleasing | formatCoin({ mantissa: 0 }) }} PHA
                                    ({{ stakePool.lastHistoryEntry.stakeReleasingPercent | formatPercent }})
                                    <b-icon
                                        v-if="stakePool.lastHistoryEntry.stakeReleasingIssue"
                                        pack="fas"
                                        icon="exclamation-triangle"
                                        size="is-small"
                                        class="is-valign-middle"
                                        v-tooltip="'Large amount of releasing stake MAY (but don`t have to) implie stake pool issue or abandon pool'"
                                    />
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <div class="has-color-gray">Not calculated yet</div>
                        </div>
                    </ui-table-column>

                    <ui-table-column
                        label="Remaining stake"
                        field="lastHistoryEntry.stakeRemaining"
                        :numeric="true"
                        :sortable="true"
                        :filter="collectionRequest.filters.lastHistoryEntry.stakeRemaining"
                    >
                        <template #header>
                            Remaining stake
                            <b-icon
                                pack="fas"
                                icon="question-circle"
                                size="is-small"
                                type="is-info"
                                class="is-valign-middle"
                                v-tooltip="'This value includes also pending withdrawals - it is total value you can stake into pool'"
                            />
                        </template>
                        <div v-if="stakePool.lastHistoryEntry">
                            <div v-if="stakePool.lastHistoryEntry.cap">
                                {{ stakePool.lastHistoryEntry.stakeRemaining | formatCoin({ mantissa: 0 }) }} PHA
                            </div>
                            <div
                                v-else
                                class="has-color-red"
                            >
                                Unlimited cap
                                <b-icon
                                    pack="fas"
                                    icon="exclamation-triangle"
                                    size="is-small"
                                    class="is-valign-middle"
                                    v-tooltip="'May favor rewards leeching'"
                                />
                            </div>
                        </div>
                        <div v-else>
                            <div class="has-color-gray">Not calculated yet</div>
                        </div>
                    </ui-table-column>

                    <ui-table-column
                        label="Issues"
                        :sortable="false"
                        :searchable="false"
                    >
                        <b-tag
                            v-for="issue in stakePool.issues"
                            :key="issue.id"
                            size="is-small"
                            :style="{ backgroundColor: issue.color }"
                            v-tooltip="issue.description"
                        >{{ issue.name }}
                        </b-tag>
                    </ui-table-column>
                </template>
            </ui-table>

        </div>
    </div>
</template>

<script lang="ts">
import { StakePool } from '#/Stats/Domain/Model/StakePool';
import { StakePoolService } from '#/Stats/Domain/Service/StakePoolService';
import * as Api from '@/core/api-frontend';
import { Annotation as API } from '@/core/api-frontend';
import BaseComponent from '#/FrontendCore/Component/BaseComponent.vue';
import { FilterConfig } from '#/FrontendCore/Component/UI/FilterField/FilterBase.vue';
import { FilterType } from '#/FrontendCore/Domain';
import { Component } from '#/FrontendCore/Vue/Annotations';
import { Inject } from '@inti5/object-manager';
import { Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';


const RuntimeStorage = namespace('StakePools/RuntimeStorage');


@Component()
export default class ListView
    extends BaseComponent
{

    @API.InjectService('stats')
    protected _stakePoolService : StakePoolService;


    public FilterType = FilterType;

    public collectionRequest : Api.Domain.CollectionRequest<StakePool> = new Api.Domain.CollectionRequest({
        filters: {
            onChainId: {},
            owner: {
                identityVerified: {},
            },
            lastHistoryEntry: {
                workersNum: {},
                avgApr: {},
                stakeTotal: {},
                stakeRemaining: {
                    $gte: 10
                },
            },
            // special filters
            _owner: {},
            _issues: {
                id: { $nin: [] }
            },
            // custom filters
            set _identityVerified (v)
            {
                (<any>this).owner.identityVerified = v ? { $eq: true } : {};
            },
            set _activeOnly (v)
            {
                (<any>this).lastHistoryEntry.avgApr.$gt = v ? 0 : undefined;
            }
        },
        sorting: {
            lastHistoryEntry: { avgApr: 'DESC' }
        },
        pagination: StakePoolService.getDefaultPagination(),
        modifiers: {
            distinctOwners: false
        }
    });

    public aprFilterConfig : FilterConfig = {
        serialize: (raw) => raw / 100,
        unserialize: (formated) => formated * 100,
    };

    public request : Promise<any> = null;
    public waitingRequest : boolean = false;

    public isLoading : boolean = false;
    public stakePools : StakePool[] = [];


    public mounted ()
    {
        this._onRouteChange();
        this._loadStakePools();
    }

    @Watch('$route')
    protected _onRouteChange ()
    {
        if (this.$route.hash && this.$route.hash.length > 1) {
            const rawRequest = this.$route.hash.substring(1);
            this.collectionRequest.fromPlainString(rawRequest, true);
        }
    }

    @Watch('collectionRequest', { deep: true })
    protected async _onCollectionRequestChange ()
    {
        this._loadStakePools();

        const currentHash = (this.$route.hash ?? '#').substring(1);
        const rawRequest = this.collectionRequest.toPlainString(true);
        if (currentHash != rawRequest) {
            this.$router.push({
                name: 'stakepools_list',
                hash: '#' + rawRequest
            });
        }
    }

    protected async _loadStakePools ()
    {
        if (this.request) {
            this.waitingRequest = true;
            return;
        }

        this.isLoading = true;

        this.request = this._stakePoolService.getCollection(this.collectionRequest);
        const collection = await this.request;

        this.stakePools = collection.items;
        this.collectionRequest.pagination.total = collection.total;

        // clear promise
        this.request = null;

        if (this.waitingRequest) {
            this.waitingRequest = false;
            this._loadStakePools();
        }
        else {
            this.isLoading = false;
        }
    }

    public onRowClick (stakePool : StakePool)
    {
        this.$router.push({
            name: 'stakepools_details',
            params: { id: stakePool.onChainId.toString() },
        });
    }

}
</script>

<style lang="scss">
@import "@/assets/scss/theme/_variables";
</style>
