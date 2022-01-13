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
            <div class="panel is-primary">
                <header class="panel-heading">
                    <div class="panel-heading-title is-justify-content-space-between">
                        <span>Stake pool #{{ stakePool.onChainId }}</span>
                    </div>
                </header>
                <div class="panel-block">

                    <div class="columns">
                        <div class="column is-4">

                            <!-- OWNER DETAILS -->
                            <div class="card">
                                <header class="card-header">
                                    <div class="card-header-title is-justify-content-space-between">
                                        <span>Owner</span>
                                    </div>
                                </header>
                                <div class="card-content">

                                    <div class="is-flex is-justify-content-start is-align-items-center">
                                        <Identicon
                                            :size="32"
                                            :value="stakePool.owner.address"
                                            class="js-clipboard account-icon"
                                            :data-clipboard-text="stakePool.owner.address"
                                        ></Identicon>
                                        <div class="ml-4">
                                            <div>
                                                <a
                                                    :href="stakePool.owner | getSubscanAccountUrl"
                                                    class="account_address"
                                                    target="_blank"
                                                >{{stakePool.owner.address}}</a>
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
                                                <span class="account_displayName">{{stakePool.owner.identity}}</span>
                                                <span class="account_displayName--alias">{{stakePool.owner.alias}}</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                        <div class="column is-4">

                            <!-- BASIC POOL STATS -->
                            <div class="card is-light">
                                <header class="card-header">
                                    <div class="card-header-title is-justify-content-space-between">
                                        <span>Basic informations</span>
                                    </div>
                                </header>
                                <div class="card-content">

                                    <div class="stats">
                                        <span class="stats_label">Avg. APR</span>
                                        <span class="stats_value">{{ stakePool.lastHistoryEntry.avgApr | formatPercent }}</span>
                                    </div>

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
.account {
    &_address {
        font-family: monospace;
        font-variant: normal;
        font-size: 0.85em;
    }

    &_displayName {
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
    &_label {
        display: inline-block;
        min-width: 30%;
    }
    &_value {
        min-width: 30%;
    }
}
</style>
