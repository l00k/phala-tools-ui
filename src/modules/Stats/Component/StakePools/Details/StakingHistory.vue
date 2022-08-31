<template>
    <div class="panel">
        <header class="panel-heading">
            <div class="panel-heading-title">
                <span>Staking History</span>
            </div>
        </header>
        <div class="panel-block">
            <div v-if="!isReady">
                <b-skeleton height="500px" :animated="true" />
            </div>

            <div v-else>
                <div class="is-flex is-justify-content-start is-align-items-start">
                    <b-taglist attached class="mr-2">
                        <b-tag type="is-light">Capacity</b-tag>
                        <b-tag
                            v-if="stakePoolEntry.lastHistoryEntry.cap"
                            :style="{ background: colors.cap, color: '#000000' }"
                        >{{ requestedLastHistoryEntry?.cap | formatCoin({ mantissa: 0 }) }} PHA</b-tag>
                        <b-tag
                            v-else
                            :style="{ background: colors.cap }"
                        >Unlimited</b-tag>
                    </b-taglist>
                    <b-taglist attached class="mr-2">
                        <b-tag type="is-light">Total stake</b-tag>
                        <b-tag :style="{ background: colors.stakeTotal }">{{ requestedLastHistoryEntry?.stakeTotal | formatCoin({ mantissa: 0 }) }} PHA</b-tag>
                    </b-taglist>
                    <b-taglist attached class="mr-2">
                        <b-tag type="is-light">Utilised stake</b-tag>
                        <b-tag :style="{ background: colors.stakeUsed }">{{ requestedLastHistoryEntry?.stakeUsed | formatCoin({ mantissa: 0 }) }} PHA</b-tag>
                    </b-taglist>
                    <b-taglist attached class="mr-2">
                        <b-tag type="is-light">Free stake</b-tag>
                        <b-tag :style="{ background: colors.stakeFree }">{{ requestedLastHistoryEntry?.stakeFree | formatCoin({ mantissa: 0 }) }} PHA</b-tag>
                    </b-taglist>
                    <b-taglist attached class="mr-2">
                        <b-tag type="is-light">Releasing stake</b-tag>
                        <b-tag :style="{ background: colors.stakeReleasing }">{{ requestedLastHistoryEntry?.stakeReleasing | formatCoin({ mantissa: 0 }) }} PHA</b-tag>
                    </b-taglist>
                    <b-taglist attached class="mr-2">
                        <b-tag type="is-light">Pending withdrawals</b-tag>
                        <b-tag :style="{ background: colors.withdrawals }">{{ requestedLastHistoryEntry?.withdrawals | formatCoin({ mantissa: 0 }) }} PHA</b-tag>
                    </b-taglist>
                </div>
            </div>

            <div
                v-show="isReady"
                ref="chartDiv"
            ></div>
        </div>
    </div>
</template>

<script lang="ts">
import { StakePoolEntry } from '#/Stats/Domain/Model/StakePoolEntry';
import { HistoryEntry } from '#/Stats/Domain/Model/HistoryEntry';
import { HistoryEntryService } from '#/Stats/Domain/Service/HistoryEntryService';
import * as Utility from '#/App/Utility';
import BaseComponent from '#/FrontendCore/Component/BaseComponent.vue';
import { Component } from '#/FrontendCore/Vue/Annotations';
import { API } from '@inti5/api-frontend';
import { Inject } from '@inti5/object-manager';
import Color from 'color';
import * as LightweightCharts from 'lightweight-charts';
import { Prop, Ref, Watch } from 'vue-property-decorator';


@Component()
export default class AprHistory
    extends BaseComponent
{

    @API.InjectService()
    protected _historyEntryService : HistoryEntryService;


    @Prop()
    public stakePoolEntry : StakePoolEntry;

    @Ref('chartDiv')
    public $chartDiv : HTMLDivElement;


    public isReady : boolean = false;

    public chart : LightweightCharts.IChartApi;

    public requestedHistoryEntries : HistoryEntry[] = [];
    public requestedTotalSeries : LightweightCharts.ISeriesApi<any>;
    public requestedUsedSeries : LightweightCharts.ISeriesApi<any>;
    public requestedFreeSeries : LightweightCharts.ISeriesApi<any>;
    public requestedReleasingSeries : LightweightCharts.ISeriesApi<any>;
    public requestedCapSeries : LightweightCharts.ISeriesApi<any>;
    public requestedWithdrawalsSeries : LightweightCharts.ISeriesApi<any>;

    protected colors = {
        cap: '#F5E022',
        stakeTotal: '#2ca4df',
        stakeUsed: '#33d778',
        stakeFree: '#FF6C37',
        stakeReleasing: '#7456fe',
        withdrawals: '#aa0000',
    };


    public get requestedLastHistoryEntry () : HistoryEntry
    {
        return this.requestedHistoryEntries.length
            ? this.requestedHistoryEntries[this.requestedHistoryEntries.length - 1]
            : null;
    }


    public mounted ()
    {
        this._reinit();
    }

    @Watch('stakePoolEntry')
    protected async _reinit ()
    {
        if (!this.stakePoolEntry) {
            return;
        }

        // clean up
        if (this.chart) {
            this.chart.remove();
            delete this.chart;
        }

        // load history
        await this._loadHistory();

        this.$nextTick(() => this._mountChart());
    }

    protected async _loadHistory ()
    {
        this.isReady = false;

        // requested stake pool
        this.requestedHistoryEntries = [];
        for await (const items of this._historyEntryService.getStakePoolHistoryFetcher(this.stakePoolEntry.id)) {
            this.requestedHistoryEntries.unshift(...items.reverse());
        }

        this.isReady = true;
    }

    protected _mountChart ()
    {
        // mount chart
        this.chart = LightweightCharts.createChart(this.$chartDiv, {
            width: this.$chartDiv.getBoundingClientRect().width,
            height: 500,
            layout: {
                backgroundColor: '#161616',
                textColor: '#d1d4dc',
            },
            grid: {
                vertLines: { color: 'rgba(42, 46, 57, 0.4)', },
                horzLines: { color: 'rgba(42, 46, 57, 0.6)', },
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
            localization: {
                priceFormatter: (value) => Utility.formatCoin(value, { mantissa: 0 })
            }
        });

        this.requestedCapSeries = this.chart.addAreaSeries({
            lineColor: this.colors.cap,
            topColor: Color(this.colors.cap).alpha(0.2).toString(),
            bottomColor: Color(this.colors.cap).alpha(0).toString(),
        });
        this.requestedTotalSeries = this.chart.addAreaSeries({
            lineColor: this.colors.stakeTotal,
            topColor: Color(this.colors.stakeTotal).alpha(0.2).toString(),
            bottomColor: Color(this.colors.stakeTotal).alpha(0).toString(),
        });
        this.requestedUsedSeries = this.chart.addAreaSeries({
            lineColor: this.colors.stakeUsed,
            topColor: Color(this.colors.stakeUsed).alpha(0.5).toString(),
            bottomColor: Color(this.colors.stakeUsed).alpha(0).toString(),
        });
        this.requestedFreeSeries = this.chart.addAreaSeries({
            lineColor: this.colors.stakeFree,
            topColor: Color(this.colors.stakeFree).alpha(0.2).toString(),
            bottomColor: Color(this.colors.stakeFree).alpha(0).toString(),
        });
        this.requestedReleasingSeries = this.chart.addAreaSeries({
            lineColor: this.colors.stakeReleasing,
            topColor: Color(this.colors.stakeReleasing).alpha(0.2).toString(),
            bottomColor: Color(this.colors.stakeReleasing).alpha(0).toString(),
        });
        this.requestedWithdrawalsSeries = this.chart.addAreaSeries({
            lineColor: this.colors.withdrawals,
            topColor: Color(this.colors.withdrawals).alpha(0.2).toString(),
            bottomColor: Color(this.colors.withdrawals).alpha(0).toString(),
        });

        // refresh chart
        this._refreshChart();
    }

    protected _refreshChart ()
    {
        {
            const data = this.requestedHistoryEntries
                .map(entry => ({
                    time: entry.entryDate.getTime() / 1000,
                    value: entry.cap
                }));
            this.requestedCapSeries.setData(data);
        }
        {
            const data = this.requestedHistoryEntries
                .map(entry => ({
                    time: entry.entryDate.getTime() / 1000,
                    value: entry.stakeTotal
                }));
            this.requestedTotalSeries.setData(data);
        }
        {
            const data = this.requestedHistoryEntries
                .map(entry => ({
                    time: entry.entryDate.getTime() / 1000,
                    value: entry.stakeUsed
                }));
            this.requestedUsedSeries.setData(data);
        }
        {
            const data = this.requestedHistoryEntries
                .map(entry => ({
                    time: entry.entryDate.getTime() / 1000,
                    value: entry.stakeFree
                }));
            this.requestedFreeSeries.setData(data);
        }
        {
            const data = this.requestedHistoryEntries
                .map(entry => ({
                    time: entry.entryDate.getTime() / 1000,
                    value: entry.stakeReleasing
                }));
            this.requestedReleasingSeries.setData(data);
        }
        {
            const data = this.requestedHistoryEntries
                .map(entry => ({
                    time: entry.entryDate.getTime() / 1000,
                    value: entry.withdrawals
                }));
            this.requestedWithdrawalsSeries.setData(data);
        }
    }

}
</script>
