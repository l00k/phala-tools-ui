<template>
    <div>
        <div
            ref="network-map-view"
            class="m-network-view"
        ></div>

        <vue-context ref="contextMenu">
            <li v-if="contextMenuNode.type == NodeType.Account">
                <a href="#"
                   class="js-clipboard"
                   :data-clipboard-text="contextMenuNode.object.address"
                >Copy</a>
            </li>
            <li v-if="contextMenuNode.type == NodeType.StakePool">
                <a href="#" @click.prevent="callMenuAction($event, MenuAction.LoadStakers)">Load stakers</a>
            </li>
            <li v-if="contextMenuNode.type == NodeType.Account">
                <a href="#" @click.prevent="callMenuAction($event, MenuAction.LoadTransfers)">Load transfers</a>
            </li>
            <li v-if="contextMenuNode.type == NodeType.Account">
                <a href="#" @click.prevent="callMenuAction($event, MenuAction.LoadTransfersSent)">Load transfers (sent)</a>
            </li>
            <li v-if="contextMenuNode.type == NodeType.Account">
                <a href="#" @click.prevent="callMenuAction($event, MenuAction.LoadTransfersRecieved)">Load transfers (recieved)</a>
            </li>
            <li v-if="contextMenuNode.type == NodeType.Account">
                <a href="#" @click.prevent="callMenuAction($event, MenuAction.LoadStakePools)">Load stake pools</a>
            </li>
            <li v-if="contextMenuNode.type == NodeType.Account">
                <a href="#" @click.prevent="callMenuAction($event, MenuAction.OpenSubscan)">Open Subscan</a>
            </li>
            <li>
                <a href="#" @click.prevent="callMenuAction($event, MenuAction.Hide)">Hide</a>
            </li>
        </vue-context>

        <Panel
            :accounts="allAccounts"
            :stake-pools="allStakePools"
            @pick-account="pickAccount"
            @pick-stakepool="pickStakePool"
            class="m-search-panel"
        ></Panel>
    </div>
</template>

<script lang="ts">
import { Component } from '@inti5/app-frontend/Vue/Annotations';
import BaseComponent from '@inti5/app-frontend/Vue/BaseComponent.vue';
import * as vis from 'vis-network';
import Utility from '#/App/Utility/Utility';
import VueContext from 'vue-context';
import { Ref } from 'vue-property-decorator';
import Color from 'color';
import Panel from '#/Analyze/Component/Panel.vue';
import {
    Account,
    balanceTypes,
    colors,
    MenuAction,
    NodeType,
    StakePool,
    stakeTypes
} from '#/Analyze/Domain/Definition';
import { namespace } from 'vuex-class';


type AssocTable<T> = { [key : number] : T };


declare const window;

const UserConfig = namespace('Analyze/UserConfig');
const Storage = namespace('Analyze/Storage');


@Component({
    components: {
        VueContext,
        Panel,
    }
})
export default class NetworkMapView
    extends BaseComponent
{

    protected MenuAction = MenuAction;
    protected NodeType = NodeType;

    @Ref('network-map-view')
    protected container : HTMLDivElement;

    @Ref('contextMenu')
    protected contextMenu : VueContext;


    @Storage.State('accounts')
    protected allAccounts : AssocTable<Account>;

    @Storage.State('stakePools')
    protected allStakePools : AssocTable<StakePool>;

    @Storage.State('transfersDirect')
    protected allTransfersDirect : AssocTable<AssocTable<number>>;

    @Storage.State('transfersInverse')
    protected allTransfersInverse : AssocTable<AssocTable<number>>;

    @UserConfig.State('accountThreshold')
    protected accountThreshold : number;

    @UserConfig.State('stakerThreshold')
    protected stakerThreshold : number;


    protected network : vis.Network;


    protected selectedAccounts : AssocTable<Account> = {};
    protected selectedStakePools : AssocTable<StakePool> = {};

    protected contextMenuNode : { key : string, type : NodeType, object : Account | StakePool } = {
        key: null,
        type: null,
        object: null
    };

    protected description : any = {
        accounts: {}
    };



    public async mounted ()
    {
        // create a network
        const entries : any = { nodes: [], edges: [] };

        this.network = new vis.Network(this.container, entries, <any>{
            layout: {
                randomSeed: 1,
                improvedLayout: true,
            },
            physics: {
                enabled: true,
            },
            interaction: {
                dragNodes: true,
                hover: false,
                multiselect: true,
            },
            nodes: {
                shape: 'custom',
            },
            edges: {
                arrows: {
                    to: {
                        enabled: true,
                        scaleFactor: 0.5
                    }
                },
                color: {
                    opacity: 0.75,
                },
                width: 2,
                length: 500,
            },
        });

        this.network.on('selectNode', this.onSelectNode.bind(this));
        this.network.on('deselectNode', this.onDeselectNode.bind(this));
        this.network.on('oncontext', (event) => {
            const key : string = <any>this.network.getNodeAt(event.pointer.DOM);
            if (!key) {
                return;
            }

            const id = key.substring(1);

            const type = key.substring(0, 1) == 'a'
                ? NodeType.Account
                : key.substring(0, 1) == 's'
                    ? NodeType.StakePool
                    : null;
            if (type == NodeType.Account) {
                this.contextMenuNode = {
                    key,
                    type,
                    object: this.allAccounts[id],
                };
            }
            else if (type == NodeType.StakePool) {
                this.contextMenuNode = {
                    key,
                    type,
                    object: this.allStakePools[id],
                };
            }
            else {
                return;
            }

            this.contextMenu.open(event.event);

            event.event.preventDefault();
        });

        this.refresh();
    }

    public pickAccount (account : Account)
    {
        this.addAccount(account.id);
        this.refresh();
    }

    protected addAccount (id : number)
    {
        if (!this.selectedAccounts[id]) {
            this.selectedAccounts[id] = this.allAccounts[id];
        }
    }

    public pickStakePool (stakePool : StakePool)
    {
        this.addStakePool(stakePool.id);
        this.refresh();
    }

    protected addStakePool (id : number)
    {
        const stakePool = this.allStakePools[id];

        if (!this.selectedStakePools[id]) {
            this.selectedStakePools[id] = stakePool;
        }

        // add owner account
        if (this.selectedAccounts[stakePool.ownerId]) {
            this.selectedAccounts[stakePool.ownerId] = {
                ...this.allAccounts[stakePool.ownerId],
                owner: true,
            };
        }
    }

    protected refresh ()
    {
        // find largest balance
        let largestBalance = 0;
        Object.values<Account>(this.selectedAccounts)
            .forEach(account => {
                largestBalance = Math.max(largestBalance, account.balanceTotal);
            });

        // final graph data
        const nodes = [];
        const edges = [];

        // stake pool nodes
        {
            let largestV = 0;
            Object.values<StakePool>(this.selectedStakePools)
                .forEach(stakePool => {
                    largestV = Math.max(largestV, stakePool.v || 0);
                });

            const stakePoolNodes = Object.values<StakePool>(this.selectedStakePools)
                .map(stakePool => {
                    const scale = Math.log(stakePool.v / largestV * 100 + 1) / 4.6;
                    const size = Math.max(20, scale * 120);

                    return {
                        id: `s${stakePool.id}`,
                        group: 0,
                        label: `#${stakePool.onChainId}`,
                        size,
                        ctxRenderer: this.nodeRendererStakePool.bind(this),
                    };
                });

            nodes.push(...stakePoolNodes);
        }

        // account nodes
        {
            const accountNodes = Object.values<Account>(this.selectedAccounts)
                .map(account => {
                    const description = this.description.accounts[account.address];
                    const alias = description?.alias;

                    const scale = Math.log(account.balanceTotal / largestBalance * 100 + 1) / 4.6;
                    const size = Math.max(account.owner ? 50 : 20, scale * 120);

                    return {
                        id: `a${account.id}`,
                        group: account.owner ? 1 : 2,
                        label: alias || account.name || Utility.formatAddress(account.address),
                        size,
                        ctxRenderer: this.nodeRendererAccount.bind(this),
                    };
                });

            nodes.push(...accountNodes);
        }

        // operator / staker edges
        {
            Object.values<StakePool>(this.selectedStakePools)
                .forEach(stakePool => {
                    edges.push({
                        from: `a${stakePool.ownerId}`,
                        to: `s${stakePool.id}`,
                        width: 10,
                        color: {
                            color: colors.edgeOwner,
                            opacity: 0.6,
                        },
                        title: 'Owner',
                    });

                    stakePool.stakers
                        .filter(staker => staker.amount > 1)
                        .forEach(staker => {
                            const container = document.createElement('div');
                            container.innerHTML = 'Staked<br/>' + Utility.formatCoin(staker.amount);

                            const scale = Math.log(staker.amount / largestBalance * 100 + 1) / 4.6;
                            const width = Math.max(4, scale * 40);

                            edges.push({
                                from: `a${staker.account}`,
                                to: `s${stakePool.id}`,
                                width,
                                color: {
                                    color: colors.edgeStaker,
                                    opacity: 0.6,
                                },
                                title: container
                            });
                        });
                });
        }

        // transfer edges
        {
            const accountIds = Object.keys(this.selectedAccounts);

            for (let i = 0; i < accountIds.length; ++i) {
                for (let j = i + 1; j < accountIds.length; ++j) {
                    const fromId = accountIds[i];
                    const toId = accountIds[j];

                    const transfer = this.allTransfersDirect[fromId]?.[toId];
                    if (transfer) {
                        const container = document.createElement('div');
                        container.innerHTML = 'Sent<br/>' + Utility.formatCoin(transfer);

                        const scale = Math.log(transfer / largestBalance * 100 + 1) / 4.6;
                        const width = Math.max(4, scale * 40);

                        edges.push({
                            from: `a${fromId}`,
                            to: `a${toId}`,
                            width,
                            color: {
                                color: colors.edgeTransfer,
                                opacity: 0.6,
                            },
                            title: container
                        });
                    }

                    const transferBack = this.allTransfersDirect[toId]?.[fromId];
                    if (transferBack) {
                        const container = document.createElement('div');
                        container.innerHTML = 'Sent<br/>' + Utility.formatCoin(transferBack);

                        const scale = Math.log(transferBack / largestBalance * 100 + 1) / 4.6;
                        const width = Math.max(4, scale * 40);

                        edges.push({
                            from: `a${toId}`,
                            to: `a${fromId}`,
                            width,
                            color: {
                                color: colors.edgeTransfer,
                                opacity: 0.6,
                            },
                            title: container
                        });
                    }
                }
            }
        }

        this.network.setData({
            nodes,
            edges,
        });

        this.network.redraw();
    }

    protected nodeRendererAccount ({ ctx, x, y, id, style, label })
    {
        const node = (<any>this.network).body.nodes[id];
        const account = this.allAccounts[id.substring(1)];
        const description = this.description.accounts[account.address];
        const size = node.baseSize / 2;

        const drawNode = () => {
            let angle = -Math.PI / 4;

            for (const balanceType of balanceTypes) {
                const sector = account[balanceType] / account.balanceTotal * 2 * Math.PI;
                if (!sector) {
                    continue;
                }

                ctx.lineWidth = 1;
                ctx.strokeStyle = '#000000';
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.arc(x, y, size, angle, angle + sector);
                ctx.lineTo(x, y);
                ctx.closePath();

                ctx.fillStyle = Color(colors[balanceType]).alpha(style.opacity || 1).string();
                ctx.fill();
                ctx.stroke();

                angle += sector;
            }

            // rest
            const angleLeft = 1.75 * Math.PI - angle;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.arc(x, y, size, angle, angle + angleLeft);
            ctx.lineTo(x, y);
            ctx.closePath();

            ctx.fillStyle = Color(colors.balanceTotal).alpha(style.opacity || 1).string();
            ctx.opacity = style.opacity;
            ctx.fill();
            ctx.stroke();

            // stroke
            ctx.beginPath();
            ctx.arc(x, y, size, 0, 2 * Math.PI);
            ctx.closePath();

            ctx.lineWidth = 3;
            const borderColor = description && description.tag
                ? colors.tagColor[description.tag]
                : colors.nodeBorderAccount;
            if (description && description.tag) {
                ctx.setLineDash([ 10, 10 ]);
            }
            ctx.strokeStyle = Color(borderColor).alpha(style.opacity || 1).string();
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = '14px sans-serif';
            const textMetrics = ctx.measureText(label);
            ctx.fillText(label, x - textMetrics.width / 2, y + size + 20);
        };

        return {
            drawNode,
            nodeDimensions: { width: 2 * size, height: 2 * size },
        };
    }

    protected nodeRendererStakePool ({ ctx, x, y, id, style, label })
    {
        const node = (<any>this.network).body.nodes[id];
        const stakePool = this.allStakePools[id.substring(1)];

        const size = node.baseSize / 2;

        const drawNode = () => {
            let offset = -Math.PI / 4;

            ctx.fillStyle = Color(colors.stakeTotal).alpha(style.opacity || 1).string();
            ctx.opacity = style.opacity;
            ctx.beginPath();
            ctx.rect(x - size, y - size, 2 * size, 2 * size);
            ctx.fill();

            for (const stakeType of stakeTypes) {
                const height = stakePool[stakeType] / stakePool.stakeTotal * 2 * size;
                if (!height) {
                    continue;
                }

                ctx.fillStyle = Color(colors[stakeType]).alpha(style.opacity || 1).string();
                ctx.opacity = style.opacity;
                ctx.beginPath();
                ctx.rect(x - size, y - size + offset, 2 * size, height);
                ctx.fill();

                offset += height;
            }

            ctx.lineWidth = 3;
            ctx.strokeStyle = Color(colors.nodeBorderStakePool).alpha(style.opacity || 1).string();
            ctx.beginPath();
            ctx.rect(x - size, y - size, 2 * size, 2 * size);
            ctx.stroke();

            ctx.fillStyle = '#000000';
            ctx.font = '14px sans-serif';
            const textMetrics = ctx.measureText(label);
            ctx.fillText(label, x - textMetrics.width / 2, y);
        };

        return {
            drawNode,
            nodeDimensions: { width: 2 * size, height: 2 * size },
        };
    }

    protected callMenuAction (event, action : MenuAction)
    {
        if (action == MenuAction.OpenSubscan) {
            const address = (<any>this.contextMenuNode.object).address;
            const url = `https://khala.subscan.io/account/${address}`;
            window.open(url, '_blank').focus();
        }
        else if (action == MenuAction.LoadStakePools) {
            const accountId = this.contextMenuNode.object.id;

            Object.values(this.allStakePools)
                .forEach(stakePool => {
                    if (stakePool.ownerId == accountId) {
                        this.addStakePool(stakePool.id);
                    }

                    stakePool.stakers.forEach(staker => {
                        if (staker.account == accountId) {
                            this.addStakePool(stakePool.id);
                        }
                    });
                });
        }
        else if (action == MenuAction.LoadStakers) {
            (<any>this.contextMenuNode.object).stakers
                .filter(staker => staker.amount > this.stakerThreshold)
                .forEach(staker => {
                    this.addAccount(staker.account);
                });
        }
        else if (action == MenuAction.LoadTransfers) {
            const accountId = (<any>this.contextMenuNode.object).id;

            Object.keys(this.allTransfersDirect[accountId])
                .forEach((toId : any) => {
                    this.addAccount(toId);
                });
            Object.keys(this.allTransfersInverse[accountId])
                .forEach((fromId : any) => {
                    this.addAccount(fromId);
                });
        }
        else if (action == MenuAction.LoadTransfersSent) {
            const accountId = (<any>this.contextMenuNode.object).id;

            Object.keys(this.allTransfersDirect[accountId])
                .forEach((toId : any) => {
                    this.addAccount(toId);
                });
        }
        else if (action == MenuAction.LoadTransfersRecieved) {
            const accountId = (<any>this.contextMenuNode.object).id;

            Object.keys(this.allTransfersInverse[accountId])
                .forEach((fromId : any) => {
                    this.addAccount(fromId);
                });
        }

        this.refresh();
    }

    protected onSelectNode (event : any)
    {
        const nodes = [ ...event.nodes ];

        Object.values((<any>this.network).body.edges)
            .forEach((edge : any) => {
                if (event.edges.includes(edge.id)) {
                    edge.options.color.opacity = 0.6;
                    nodes.push(edge.fromId, edge.toId);
                }
                else {
                    edge.options.color.opacity = 0.15;
                }
            });

        Object.values((<any>this.network).body.nodes)
            .forEach((node : any) => {
                node.options.opacity = nodes.includes(node.id)
                    ? 1.00
                    : 0.15;
            });

        this.network.redraw();
    }

    protected onDeselectNode (event : any)
    {
        Object.values((<any>this.network).body.edges)
            .forEach((edge : any) => {
                edge.options.color.opacity = 0.6;
            });

        Object.values((<any>this.network).body.nodes)
            .forEach((node : any) => {
                node.options.opacity = 1.00;
            });

        this.network.redraw();
    }

}
</script>

<style scoped lang="scss">
.m-root {
    position: relative;
}

.m-network-view {
    width:  100%;
    height: calc(100vh);
}

.m-search-panel {
    position: absolute;
    left:     20px;
    top:      20px;

    opacity:  0.25;

    &:hover {
        opacity: 1;
    }
}
</style>

<style lang="scss">
.vis-tooltip {
    position:      absolute;
    z-index:       1;

    padding:       4px 8px;

    background:    $card-background-color;
    border:        solid 1px rgba(0, 0, 0, 0.5);
    border-radius: 2px;
}
</style>
