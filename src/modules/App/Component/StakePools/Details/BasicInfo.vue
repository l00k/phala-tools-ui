<template>
    <div class="panel is-primary">
        <header class="panel-heading">
            <div class="panel-heading-title is-justify-content-space-between">
                <span>
                    Stake pool
                    <span v-if="!stakePool">(loading)</span>
                    <span v-else-if="stakePool.onChainId">#{{ stakePool.onChainId }}</span>
                </span>
            </div>
        </header>
        <div class="panel-block">
            <!-- INFO PLACEHOLDER -->
            <div
                v-if="!stakePool"
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
                class="columns"
            >
                <!-- SPECIAL ENTRY -->
                <div
                    v-if="stakePool.special"
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
                                {{ stakePool.special }}
                            </div>

                        </div>
                    </div>
                </div>

                <!-- OWNER DETAILS -->
                <div
                    v-if="stakePool.owner"
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
                                    :value="stakePool.owner.address"
                                    class="js-clipboard account__icon"
                                    :data-clipboard-text="stakePool.owner.address"
                                ></Identicon>
                                <div class="ml-4">
                                    <div>
                                        <a
                                            :href="stakePool.owner | getSubscanAccountUrl"
                                            class="account__address"
                                            target="_blank"
                                        >{{ stakePool.owner.address }}</a>
                                    </div>
                                    <div>
                                        <b-icon
                                            v-if="stakePool.owner.identityVerified"
                                            pack="fas"
                                            icon="check-square"
                                            size="is-small"
                                            type="is-primary"
                                            class="is-valign-middle mr-2"
                                            v-tooltip="'Identity judgement'"
                                        />
                                        <span class="account__displayName">{{ stakePool.owner.identity }}</span>
                                        <span class="account__displayName--alias">{{ stakePool.owner.alias }}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- BASIC POOL STATS -->
                <div
                    v-if="stakePool.lastHistoryEntry"
                    class="column is-4"
                >
                    <div class="card is-light">
                        <header class="card-header">
                            <div class="card-header-title">
                                <span>Basic informations</span>
                            </div>
                        </header>
                        <div class="card-content">

                            <div class="stats">
                                <span class="stats__label">Avg APR</span>
                                <span class="stats__value">{{ stakePool.lastHistoryEntry.avgApr | formatPercent }}</span>
                            </div>
                            <div class="stats">
                                <span class="stats__label">Current APR</span>
                                <span class="stats__value">{{ stakePool.lastHistoryEntry.currentApr | formatPercent }}</span>
                            </div>
                            <div class="stats">
                                <span class="stats__label">Daily rewards per 1000 PHA</span>
                                <span class="stats__value">{{ getRewardsPer(stakePool, 1000, 1) | formatCoin({ mantissa: 2 }) }} PHA</span>
                            </div>
                            <div class="stats">
                                <span class="stats__label">Monthly rewards per 1000 PHA</span>
                                <span class="stats__value">{{ getRewardsPer(stakePool, 1000, 30) | formatCoin({ mantissa: 2 }) }} PHA</span>
                            </div>

                        </div>
                    </div>

                </div>

                <!-- ISSUES -->
                <div
                    v-if="stakePool.issues?.length"
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
                                v-for="issue in stakePool.issues"
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
import { StakePool } from '#/App/Domain/Model/StakePool';
import BaseComponent from '@inti5/app-frontend/Component/BaseComponent.vue';
import { Component } from '@inti5/app-frontend/Vue/Annotations';
import { Prop } from 'vue-property-decorator';


@Component()
export default class BasicInfo
    extends BaseComponent
{

    @Prop()
    public stakePool : StakePool;


    public getRewardsPer (stakePool : StakePool, amount : number, days : number)
    {
        return amount * stakePool.lastHistoryEntry.avgApr * (days / 365);
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
        width:   50%;
    }
    &__value {
        width: 50%;
    }
}
</style>
