<template>
    <div class="panel is-primary mb-4">
        <header class="panel-heading">
            <div class="panel-heading-title is-justify-content-space-between">
                <span>Stake pools</span>
                <span></span>
            </div>
        </header>
        <div class="panel-block">
            <b-notification
                v-if="isOutdated"
                type="is-warning"
            >
                Stats seems outdated!<br/>
                Last update: {{ networkState.snapshot.date | formatDatetime }}<br/>
            </b-notification>


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

                <b-field class="mr-2">
                    <b-checkbox-button
                        v-model="collectionRequest.filters._observedOnly"
                        :disabled="!watchdogAvailable || !observedPoolsLoaded"
                        :native-value="true"
                        type="is-primary"
                        class="filter-watchdog"
                        v-tooltip="!watchdogAvailable ? 'You need to login to watchdog first' : ''"
                    >
                        <b-icon
                            :icon="observedPoolsLoaded ? 'tower-observation' : 'circle-notch fa-spin'"
                        ></b-icon>
                        <span>Observed in watchdog</span>
                    </b-checkbox-button>
                </b-field>
            </div>

            <ui-table
                :data="stakePoolEntries"
                :loading="isLoading"
                :sorting.sync="collectionRequest.sorting"
                :sort-multiple="true"
                :backend="true"
                :pagination="collectionRequest.pagination"
                :hoverable="true"
                ref="list"
                @click="onRowClick"
                @clearFilters="onClearFilters"
            >
                <template #actions>&nbsp;</template>

                <template #default="{ row: stakePoolEntry }">
                    <ui-table-column
                        label="ID"
                        field="stakePool.onChainId"
                        :numeric="true"
                        :sortable="true"
                        :filter="collectionRequest.filters.stakePool.onChainId"
                    >
                        #{{ stakePoolEntry.stakePool.onChainId }}
                    </ui-table-column>

                    <ui-table-column
                        label="Owner"
                        field="stakePool.owner.identityVerified"
                        :sortable="true"
                        :filter="collectionRequest.filters._owner"
                    >
                        <div class="has-font-size-sm">
                            <a
                                :href="stakePoolEntry.stakePool.owner | getSubscanAccountUrl"
                                class="has-color-gray"
                                target="_blank"
                            >{{ stakePoolEntry.stakePool.owner.address | formatAddress }}</a>
                        </div>
                        <div :class="{ 'has-color-primary': stakePoolEntry.stakePool.owner.identityVerified }">
                            <b-icon
                                v-if="stakePoolEntry.stakePool.owner.identityVerified"
                                pack="fas"
                                icon="check-square"
                                size="is-small"
                                class="is-valign-middle"
                                v-tooltip="'Identity judgement'"
                            />
                            {{ stakePoolEntry.stakePool.owner.identity }}
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
                        <div v-if="stakePoolEntry.lastHistoryEntry">
                            <div>Avg: {{ stakePoolEntry.lastHistoryEntry.avgApr | formatPercent }}</div>
                            <div
                                class="has-font-size-sm"
                                :class="{
                                    'has-color-red': stakePoolEntry.lastHistoryEntry.currentApr == 0,
                                    'has-color-orange': (stakePoolEntry.lastHistoryEntry.avgApr / stakePoolEntry.lastHistoryEntry.currentApr) >= 2,
                                    'has-color-gray': (stakePoolEntry.lastHistoryEntry.avgApr / stakePoolEntry.lastHistoryEntry.currentApr) < 2,
                                }"
                            >
                                Current: {{ stakePoolEntry.lastHistoryEntry.currentApr | formatPercent }}
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
                        <div v-if="stakePoolEntry.lastHistoryEntry">
                            <div>{{ stakePoolEntry.lastHistoryEntry.stakeTotal | formatCoin({ mantissa: 0 }) }} PHA</div>
                            <div class="has-font-size-sm has-color-gray">
                                <div :class="{ 'has-color-red': stakePoolEntry.lastHistoryEntry.stakeFreeIssue }">
                                    Free:
                                    {{ stakePoolEntry.lastHistoryEntry.stakeFree | formatCoin({ mantissa: 0 }) }} PHA
                                    ({{ stakePoolEntry.lastHistoryEntry.stakeFreePercent | formatPercent }})
                                    <b-icon
                                        v-if="stakePoolEntry.lastHistoryEntry.stakeFreeIssue"
                                        pack="fas"
                                        icon="exclamation-triangle"
                                        size="is-small"
                                        class="is-valign-middle"
                                        v-tooltip="'Large amount of free stake implies leeching or abandon pool'"
                                    />
                                </div>
                                <div :class="{ 'has-color-orange': stakePoolEntry.lastHistoryEntry.stakeReleasingIssue }">
                                    Releasing: {{ stakePoolEntry.lastHistoryEntry.stakeReleasing | formatCoin({ mantissa: 0 }) }} PHA
                                    ({{ stakePoolEntry.lastHistoryEntry.stakeReleasingPercent | formatPercent }})
                                    <b-icon
                                        v-if="stakePoolEntry.lastHistoryEntry.stakeReleasingIssue"
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
                        <div v-if="stakePoolEntry.lastHistoryEntry">
                            <div v-if="stakePoolEntry.lastHistoryEntry.cap">
                                {{ stakePoolEntry.lastHistoryEntry.stakeRemaining | formatCoin({ mantissa: 0 }) }} PHA
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
                            v-for="issue in stakePoolEntry.issues"
                            v-if="issue?.id"
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
import { NetworkState } from '#/Stats/Domain/Model/NetworkState';
import { StakePoolEntry } from '#/Stats/Domain/Model/StakePoolEntry';
import { NetworkStateService } from '#/Stats/Domain/Service/NetworkStateService';
import { StakePoolEntryService } from '#/Stats/Domain/Service/StakePoolEntryService';
import * as Api from '@inti5/api-frontend';
import { API } from '@inti5/api-frontend';
import BaseComponent from '#/FrontendCore/Component/BaseComponent.vue';
import { FilterConfig } from '#/FrontendCore/Component/UI/FilterField/FilterBase.vue';
import { FilterType } from '#/FrontendCore/Domain';
import { Component } from '#/FrontendCore/Vue/Annotations';
import { Inject } from '@inti5/object-manager';
import { Watch } from 'vue-property-decorator';
import moment from 'moment';


let _observedPools : number[] = [];

@Component()
export default class ListView
    extends BaseComponent
{

    @API.InjectService()
    protected _networkStateService : NetworkStateService;

    @API.InjectService()
    protected _stakePoolService : StakePoolEntryService;


    public FilterType = FilterType;

    public collectionRequest : Api.Domain.CollectionRequest<StakePoolEntry> = new Api.Domain.CollectionRequest({
        filters: {
            stakePool: {
                onChainId: {},
                owner: {
                    identityVerified: {},
                },
            },
            lastHistoryEntry: {
                workersNum: {},
                avgApr: {},
                stakeTotal: {},
                stakeRemaining: {},
            },
            // special filters
            _owner: {},
            _issues: {
                id: { $nin: [] }
            },

            // custom filters
            set _identityVerified (v)
            {
                (this as Api.Domain.Filters<StakePoolEntry>).stakePool.owner.identityVerified = v ? { $eq: true } : {};
            },
            set _activeOnly (v)
            {
                (this as Api.Domain.Filters<StakePoolEntry>).lastHistoryEntry.avgApr.$gt = v ? 0 : undefined;
            },
            set _observedOnly (v)
            {
                (this as Api.Domain.Filters<StakePoolEntry>).stakePool.onChainId.$in = v ? [ ..._observedPools ] : undefined;
            }
        },
        sorting: {
            lastHistoryEntry: { avgApr: 'DESC' }
        },
        pagination: StakePoolEntryService.getDefaultPagination(),
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
    public stakePoolEntries : StakePoolEntry[] = [];

    public watchdogAvailable : boolean = false;
    public observedPoolsLoaded : boolean = false;

    public networkState : NetworkState;
    public isOutdated : boolean = false;


    public async mounted ()
    {
        this._loadNetworkState();
        this._loadObservedPools();

        this._onRouteChange();
    }

    @Watch('$route')
    protected _onRouteChange ()
    {
        if (this.$route.name !== 'stakepools_list') {
            // confirm route
            return;
        }

        this.collectionRequest.clearFilters();

        if (this.$route.hash && this.$route.hash.length > 1) {
            const rawRequest = this.$route.hash.substring(1);
            this.collectionRequest.fromPlainString(rawRequest, true);
        }
        else {
            this.collectionRequest.filters.lastHistoryEntry.stakeRemaining = { $gte: 10 };
        }

        this._loadStakePools();
    }

    @Watch('collectionRequest', { deep: true })
    protected async _onCollectionRequestChange ()
    {
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

        this.stakePoolEntries = collection.items;
        this.collectionRequest.pagination.total = collection.total;

        // clear promise
        this.request = null;
        this.isLoading = false;

        if (this.waitingRequest) {
            this.waitingRequest = false;
            this._loadStakePools();
        }
    }

    protected async _loadNetworkState()
    {
        this.networkState = await this._networkStateService.getLatestNetworkState();

        const dateThresholdMoment = moment.utc().subtract(7, 'hours');
        this.isOutdated = moment.utc(this.networkState.snapshot.date).isBefore(dateThresholdMoment);
    }

    protected async _loadObservedPools()
    {
        _observedPools = [];

        await this.$store.dispatch('Watchdog/RuntimeStorage/init');

        this.watchdogAvailable = this.$store.state['Watchdog/RuntimeStorage'].isLoggedIn;

        const observations = this.$store.getters['Watchdog/RuntimeStorage/observations'];
        if (observations?.length > 0) {
            _observedPools = observations.map(obs => obs.stakePool.onChainId);
        }

        this.observedPoolsLoaded = true;
    }

    public onRowClick (stakePoolEntry : StakePoolEntry)
    {
        this.$router.push({
            name: 'stakepools_details',
            params: { id: stakePoolEntry.stakePool.onChainId.toString() },
        });
    }

    public onClearFilters()
    {
        this.collectionRequest.clearFilters();
        this._onCollectionRequestChange();
    }

}
</script>

<style lang="scss">
@import "@/assets/scss/theme/_variables";
</style>
