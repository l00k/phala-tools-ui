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
                        <b-tag type="is-light">Total stake</b-tag>
                        <b-tag :style="{ background: colors.stakeTotal }">{{ requestedLastHistoryEntry?.stakeTotal | formatCoin({ mantissa: 0 }) }} PHA</b-tag>
                    </b-taglist>
                    <b-taglist attached class="mr-2">
                        <b-tag type="is-light">Free stake</b-tag>
                        <b-tag :style="{ background: colors.stakeFree }">{{ requestedLastHistoryEntry?.stakeFree | formatCoin({ mantissa: 0 }) }} PHA</b-tag>
                    </b-taglist>
                    <b-taglist attached class="mr-2">
                        <b-tag type="is-light">Releasing stake</b-tag>
                        <b-tag :style="{ background: colors.stakeReleasing }">{{ requestedLastHistoryEntry?.stakeReleasing | formatCoin({ mantissa: 0 }) }} PHA</b-tag>
                    </b-taglist>
                </div>
                <div class="is-flex is-justify-content-start is-align-items-start">
                    <b-taglist attached class="mr-2">
                        <b-tag type="is-dark">TOP avg total stake</b-tag>
                        <b-tag :style="{ background: colors.stakeTotal }">{{ specialLastHistoryEntry?.stakeTotal | formatCoin({ mantissa: 0 }) }} PHA</b-tag>
                    </b-taglist>
                    <b-taglist attached class="mr-2">
                        <b-tag type="is-dark">TOP avg free stake</b-tag>
                        <b-tag :style="{ background: colors.stakeFree }">{{ specialLastHistoryEntry?.stakeFree | formatCoin({ mantissa: 0 }) }} PHA</b-tag>
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
import { StakePool } from '#/App/Domain/Model/StakePool';
import { HistoryEntry } from '#/App/Domain/Model/StakePool/HistoryEntry';
import { HistoryEntryService } from '#/App/Domain/Service/HistoryEntryService';
import * as Utility from '#/App/Utility';
import BaseComponent from '@inti5/app-frontend/Component/BaseComponent.vue';
import { Component } from '@inti5/app-frontend/Vue/Annotations';
import { Inject } from '@inti5/object-manager';
import Color from 'color';
import * as LightweightCharts from 'lightweight-charts';
import { Prop, Ref, Watch } from 'vue-property-decorator';


@Component()
export default class AprHistory
    extends BaseComponent
{

    @Inject()
    protected historyEntryService : HistoryEntryService;

    @Prop()
    protected stakePool : StakePool;

    @Ref('chartDiv')
    protected $chartDiv : HTMLDivElement;


    protected isReady : boolean = false;

    protected chart : LightweightCharts.IChartApi;

    protected requestedHistoryEntries : HistoryEntry[] = [];
    protected requestedTotalSeries : LightweightCharts.ISeriesApi<any>;
    protected requestedFreeSeries : LightweightCharts.ISeriesApi<any>;
    protected requestedReleasingSeries : LightweightCharts.ISeriesApi<any>;

    protected specialHistoryEntries : HistoryEntry[] = [];
    protected specialTotalSeries : LightweightCharts.ISeriesApi<any>;
    protected specialFreeSeries : LightweightCharts.ISeriesApi<any>;

    protected colors = {
        stakeTotal: '#2ca4df',
        stakeFree: '#aa0000',
        stakeReleasing: '#7456fe',
    };


    public get requestedLastHistoryEntry () : HistoryEntry
    {
        return this.requestedHistoryEntries.length
            ? this.requestedHistoryEntries[this.requestedHistoryEntries.length - 1]
            : null;
    }

    public get specialLastHistoryEntry () : HistoryEntry
    {
        return this.specialHistoryEntries.length
            ? this.specialHistoryEntries[this.specialHistoryEntries.length - 1]
            : null;
    }


    public mounted ()
    {
        this.reinit();
    }

    @Watch('stakePool')
    protected async reinit ()
    {
        if (!this.stakePool) {
            return;
        }

        // clean up
        if (this.chart) {
            this.chart.remove();
            delete this.chart;
        }

        // load history
        await this.loadHistory();

        this.$nextTick(() => this.mountChart());
    }

    protected async loadHistory ()
    {
        this.isReady = false;

        // requested stake pool
        this.requestedHistoryEntries = [];
        for await (const items of this.historyEntryService.getStakePoolHistoryFetcher(this.stakePool.id)) {
            this.requestedHistoryEntries.unshift(...items.reverse());
        }

        // avg top history
        this.specialHistoryEntries = [];
        for await (const items of this.historyEntryService.getStakePoolHistoryFetcher(StakePool.SPECIAL_TOP_AVG_ID)) {
            this.specialHistoryEntries.unshift(...items.reverse());
        }

        this.isReady = true;
    }

    protected mountChart ()
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

        this.requestedTotalSeries = this.chart.addAreaSeries({
            lineColor: this.colors.stakeTotal,
            topColor: Color(this.colors.stakeTotal).alpha(0.6).toString(),
            bottomColor: Color(this.colors.stakeTotal).alpha(0).toString(),
        });
        this.requestedFreeSeries = this.chart.addAreaSeries({
            lineColor: this.colors.stakeFree,
            topColor: Color(this.colors.stakeFree).alpha(0.6).toString(),
            bottomColor: Color(this.colors.stakeFree).alpha(0).toString(),
        });
        this.requestedReleasingSeries = this.chart.addAreaSeries({
            lineColor: this.colors.stakeReleasing,
            topColor: Color(this.colors.stakeReleasing).alpha(0.6).toString(),
            bottomColor: Color(this.colors.stakeReleasing).alpha(0).toString(),
        });

        this.specialTotalSeries = this.chart.addLineSeries({
            color: this.colors.stakeTotal,
            lineStyle: LightweightCharts.LineStyle.Dashed,
            lineWidth: 1,
            priceLineVisible: false,
        });
        this.specialFreeSeries = this.chart.addLineSeries({
            color: this.colors.stakeFree,
            lineStyle: LightweightCharts.LineStyle.Dashed,
            lineWidth: 1,
            priceLineVisible: false,
        });

        // refresh chart
        this.refreshChart();
    }

    protected refreshChart ()
    {
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
            const data = this.specialHistoryEntries
                .map(entry => ({
                    time: entry.entryDate.getTime() / 1000,
                    value: entry.stakeTotal
                }));
            this.specialTotalSeries.setData(data);
        }
        {
            const data = this.specialHistoryEntries
                .map(entry => ({
                    time: entry.entryDate.getTime() / 1000,
                    value: entry.stakeFree
                }));
            this.specialFreeSeries.setData(data);
        }
    }

}
</script>
