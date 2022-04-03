<template>
    <div class="panel is-primary">
        <header class="panel-heading">
            <div class="panel-heading-title is-justify-content-space-between">
                <span>
                    Stake pool
                    <span v-if="!stakePoolEntry">(loading)</span>
                    <span v-else-if="stakePoolEntry.stakePool.onChainId">#{{ stakePoolEntry.stakePool.onChainId }}</span>
                </span>
            </div>
        </header>
        <div class="panel-block">
            <!-- INFO PLACEHOLDER -->
            <div
                v-if="!stakePoolEntry"
                class="columns"
            >
                <div class="column is-4">
                    <div class="card">
                        <header class="card-header">
                            <div class="card-header-title">
                                <b-skeleton width="20%" :animated="true" />
                            </div>
                        </header>
                        <div class="card-content">
                            <b-skeleton :animated="true" />
                            <b-skeleton :animated="true" />
                            <b-skeleton :animated="true" />
                        </div>
                    </div>
                </div>
                <div class="column is-4">
                    <div class="card">
                        <header class="card-header">
                            <div class="card-header-title">
                                <b-skeleton width="20%" :animated="true" />
                            </div>
                        </header>
                        <div class="card-content">
                            <b-skeleton :animated="true" />
                            <b-skeleton :animated="true" />
                            <b-skeleton :animated="true" />
                        </div>
                    </div>
                </div>
                <div class="column is-4">
                    <div class="card">
                        <header class="card-header">
                            <div class="card-header-title">
                                <b-skeleton width="20%" :animated="true" />
                            </div>
                        </header>
                        <div class="card-content">
                            <b-skeleton :animated="true" />
                            <b-skeleton :animated="true" />
                            <b-skeleton :animated="true" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- INFO CONTENT -->
            <div
                v-else
                class="columns is-multiline"
            >
                <!-- SPECIAL ENTRY -->
                <div
                    v-if="stakePoolEntry.special"
                    class="column is-4"
                >
                    <div class="card">
                        <header class="card-header">
                            <div class="card-header-title">
                                <span>SPECIAL</span>
                            </div>
                        </header>
                        <div class="card-content">

                            <div class="">
                                {{ stakePoolEntry.special }}
                            </div>

                        </div>
                    </div>
                </div>

                <!-- OWNER DETAILS -->
                <div
                    v-if="stakePoolEntry.stakePool"
                    class="column is-4"
                >
                    <div class="card">
                        <header class="card-header">
                            <div class="card-header-title">
                                <span>Owner</span>
                            </div>
                        </header>
                        <div class="card-content">

                            <div class="is-flex is-justify-content-start is-align-items-center">
                                <Identicon
                                    :size="32"
                                    :value="stakePoolEntry.stakePool.owner.address"
                                    class="js-clipboard account__icon"
                                    :data-clipboard-text="stakePoolEntry.stakePool.owner.address"
                                ></Identicon>
                                <div class="ml-4">
                                    <div>
                                        <a
                                            :href="stakePoolEntry.stakePool.owner | getSubscanAccountUrl"
                                            class="account__address"
                                            target="_blank"
                                        >{{ stakePoolEntry.stakePool.owner.address }}</a>
                                    </div>
                                    <div>
                                        <b-icon
                                            v-if="stakePoolEntry.stakePool.owner.identityVerified"
                                            pack="fas"
                                            icon="check-square"
                                            size="is-small"
                                            type="is-primary"
                                            class="is-valign-middle mr-2"
                                            v-tooltip="'Identity judgement'"
                                        />
                                        <span class="account__displayName">{{ stakePoolEntry.stakePool.owner.identity }}</span>
                                        <span class="account__displayName--alias">{{ stakePoolEntry.stakePool.owner.alias }}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- STAKE IMFO -->
                <div
                    v-if="stakePoolEntry.lastHistoryEntry"
                    class="column is-4"
                >
                    <div class="card is-light">
                        <header class="card-header">
                            <div class="card-header-title">
                                <span>Stake info</span>
                            </div>
                        </header>
                        <div class="card-content">

                            <div
                                class="stats"
                                :class="{ 'has-color-red': !stakePoolEntry.lastHistoryEntry.cap }"
                            >
                                <span class="stats__label">Capacity</span>
                                <span
                                    v-if="stakePoolEntry.lastHistoryEntry.cap"
                                    class="stats__value"
                                >{{ stakePoolEntry.lastHistoryEntry.cap | formatCoin({ mantissa: 0 }) }} PHA</span>
                                <span
                                    v-else
                                    class="stats__value"
                                >
                                    Unlimited
                                    <b-icon
                                        v-if="!stakePoolEntry.lastHistoryEntry.cap"
                                        pack="fas"
                                        icon="exclamation-triangle"
                                        size="is-small"
                                        class="is-valign-middle"
                                        v-tooltip="'May favor rewards leeching'"
                                    />
                                </span>
                            </div>
                            <div class="stats">
                                <span class="stats__label">Total stake</span>
                                <span class="stats__value">{{ stakePoolEntry.lastHistoryEntry.stakeTotal | formatCoin({ mantissa: 0 }) }} PHA</span>
                            </div>
                            <div
                                class="stats"
                                :class="{ 'has-color-red': stakePoolEntry.lastHistoryEntry.stakeFreeIssue }"
                            >
                                <span class="stats__label">Free stake</span>
                                <span class="stats__value">
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
                                </span>
                            </div>
                            <div
                                class="stats"
                                :class="{ 'has-color-orange': stakePoolEntry.lastHistoryEntry.stakeReleasingIssue }"
                            >
                                <span class="stats__label">Releasing stake</span>
                                <span class="stats__value">
                                    {{ stakePoolEntry.lastHistoryEntry.stakeReleasing | formatCoin({ mantissa: 0 }) }} PHA
                                    ({{ stakePoolEntry.lastHistoryEntry.stakeReleasingPercent | formatPercent }})
                                    <b-icon
                                        v-if="stakePoolEntry.lastHistoryEntry.stakeReleasingIssue"
                                        pack="fas"
                                        icon="exclamation-triangle"
                                        size="is-small"
                                        class="is-valign-middle"
                                        v-tooltip="'Large amount of releasing stake MAY (but don`t have to) implie stake pool issue or abandon pool'"
                                    />
                                </span>
                            </div>
                            <div
                                class="stats"
                                :class="{ 'has-color-orange': stakePoolEntry.lastHistoryEntry.widthdrawalsIssue }"
                            >
                                <span class="stats__label">Pending withdrawals</span>
                                <span class="stats__value">
                                    {{ stakePoolEntry.lastHistoryEntry.withdrawals | formatCoin({ mantissa: 0 }) }} PHA
                                    ({{ stakePoolEntry.lastHistoryEntry.withdrawalsPercent | formatPercent }})
                                    <b-icon
                                        v-if="stakePoolEntry.lastHistoryEntry.widthdrawalsIssue"
                                        pack="fas"
                                        icon="exclamation-triangle"
                                        size="is-small"
                                        class="is-valign-middle"
                                        v-tooltip="'Large percent of withdrawals MAY (but don`t have to) implie stake pool issue or abandon pool'"
                                    />
                                </span>
                            </div>

                        </div>
                    </div>

                </div>

                <!-- BASIC POOL STATS -->
                <div
                    v-if="stakePoolEntry.lastHistoryEntry"
                    class="column is-4"
                >
                    <div class="card is-light">
                        <header class="card-header">
                            <div class="card-header-title">
                                <span>Performance</span>
                            </div>
                        </header>
                        <div class="card-content">

                            <div class="stats">
                                <span class="stats__label">Current commission</span>
                                <span class="stats__value">{{ stakePoolEntry.lastHistoryEntry.commission | formatPercent }}</span>
                            </div>

                            <div class="stats">
                                <span class="stats__label">Avg APR</span>
                                <span class="stats__value">{{ stakePoolEntry.lastHistoryEntry.avgApr | formatPercent }}</span>
                            </div>
                            <div
                                class="stats"
                                :class="{
                                    'has-color-red': stakePoolEntry.lastHistoryEntry.currentApr == 0,
                                    'has-color-orange': (stakePoolEntry.lastHistoryEntry.avgApr / stakePoolEntry.lastHistoryEntry.currentApr) >= 2,
                                }"
                            >
                                <span class="stats__label">Current APR</span>
                                <span class="stats__value">{{ stakePoolEntry.lastHistoryEntry.currentApr | formatPercent }}</span>
                            </div>
                            <div class="stats">
                                <span class="stats__label">Daily rewards per 1000 PHA</span>
                                <span class="stats__value">{{ getRewardsPer(stakePoolEntry, 1000, 1) | formatCoin({ mantissa: 2 }) }} PHA</span>
                            </div>
                            <div class="stats">
                                <span class="stats__label">Monthly rewards per 1000 PHA</span>
                                <span class="stats__value">{{ getRewardsPer(stakePoolEntry, 1000, 30) | formatCoin({ mantissa: 2 }) }} PHA</span>
                            </div>

                        </div>
                    </div>

                </div>

                <!-- ISSUES -->
                <div
                    v-if="stakePoolEntry.issues?.length"
                    class="column is-4"
                >
                    <div class="card is-light">
                        <header class="card-header">
                            <div class="card-header-title">
                                <span>Issues</span>
                            </div>
                        </header>
                        <div class="card-content">

                            <div
                                v-for="issue in stakePoolEntry.issues"
                                class="mb-2"
                            >
                                <b-tag
                                    size="is-small"
                                    :style="{ backgroundColor: issue.color }"
                                >{{ issue.name }}
                                </b-tag>
                                <div class="has-color-gray">
                                    {{ issue.description }}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
import { StakePoolEntry } from '#/Stats/Domain/Model/StakePoolEntry';
import BaseComponent from '#/FrontendCore/Component/BaseComponent.vue';
import { Component } from '#/FrontendCore/Vue/Annotations';
import { Prop } from 'vue-property-decorator';


@Component()
export default class BasicInfo
    extends BaseComponent
{

    @Prop()
    public stakePoolEntry : StakePoolEntry;


    public getRewardsPer (stakePoolEntry : StakePoolEntry, amount : number, days : number)
    {
        return amount * stakePoolEntry.lastHistoryEntry.avgApr * (days / 365);
    }
}
</script>

<style lang="scss">
.account {
    &__icon {
        svg {
            border:        solid 1px rgba(0, 0, 0, 0.25);
            border-radius: 2px;
        }
    }

    &__address {
        font-family:  monospace;
        font-variant: normal;
        font-size:    0.85em;
    }

    &__displayName {
        font-weight: bold;

        span {
            &--alias {
                &:before {
                    content: '(';
                }
                &:after {
                    content: ')';
                }
            }

            &:empty {
                display: none;
            }
        }
    }
}

.stats {
    &__label {
        display: inline-block;
        width:   60%;
    }
    &__value {
        display: inline-block;
        width:   40%;
    }
}
</style>
