<template>
    <div class="panel">
        <header class="panel-heading">
            <div class="panel-heading-title">
                <span>APR History</span>
            </div>
        </header>
        <div class="panel-block">
            <div v-if="!isReady">
                <b-skeleton height="400px" :animated="true" />
            </div>

            <div v-else>
                <div class="is-flex is-justify-content-start is-align-items-start">
                    <b-taglist attached class="mr-2">
                        <b-tag type="is-light">Pool avg APR</b-tag>
                        <b-tag :style="{ background: colors.requestAvgApr }">{{ requestedLastHistoryEntry?.avgApr | formatPercent }}</b-tag>
                    </b-taglist>

                    <b-taglist attached class="mr-2">
                        <b-tag type="is-light">Entire network avg APR</b-tag>
                        <b-tag :style="{ background: colors.specialAll }">{{ specialAllLastHistoryEntry?.avgApr | formatPercent }}</b-tag>
                    </b-taglist>

                    <b-taglist attached class="mr-2">
                        <b-tag type="is-light">TOP100 avg APR</b-tag>
                        <b-tag :style="{ background: colors.specialTop100 }">{{ specialTop100LastHistoryEntry?.avgApr | formatPercent }}</b-tag>
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
import { Pagination } from '@inti5/api-frontend/Domain';
import BaseComponent from '@inti5/app-frontend/Component/BaseComponent.vue';
import { Component } from '@inti5/app-frontend/Vue/Annotations';
import { Inject } from '@inti5/object-manager';
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

    protected historyEntriesPagination : Pagination = HistoryEntryService.getDefaultPagination();
    protected fullyLoaded : boolean = false;

    protected requestedHistoryEntries : HistoryEntry[] = [];
    protected requestedSeries : LightweightCharts.ISeriesApi<any>;

    protected specialAllHistoryEntries : HistoryEntry[] = [];
    protected specialAllSeries : LightweightCharts.ISeriesApi<any>;

    protected specialTop100HistoryEntries : HistoryEntry[] = [];
    protected specialTop100Series : LightweightCharts.ISeriesApi<any>;

    protected colors = {
        requestAvgApr: '#33d778',
        specialAll: '#2ca4df',
        specialTop100: '#447ec6',
    };


    public get requestedLastHistoryEntry () : HistoryEntry
    {
        return this.requestedHistoryEntries.length
            ? this.requestedHistoryEntries[this.requestedHistoryEntries.length - 1]
            : null;
    }

    public get specialAllLastHistoryEntry () : HistoryEntry
    {
        return this.specialAllHistoryEntries.length
            ? this.specialAllHistoryEntries[this.specialAllHistoryEntries.length - 1]
            : null;
    }

    public get specialTop100LastHistoryEntry () : HistoryEntry
    {
        return this.specialTop100HistoryEntries.length
            ? this.specialTop100HistoryEntries[this.specialTop100HistoryEntries.length - 1]
            : null;
    }


    public mounted()
    {
        this.refreshChart();
    }

    @Watch('stakePool')
    protected async restartChart ()
    {
        if (!this.stakePool) {
            return;
        }

        this.isReady = false;

        // clean up
        if (this.chart) {
            this.chart.remove();
            delete this.chart;
        }

        this.historyEntriesPagination = HistoryEntryService.getDefaultPagination();
        this.fullyLoaded = false;

        this.requestedHistoryEntries = [];
        this.specialAllHistoryEntries = [];
        this.specialTop100HistoryEntries = [];

        // load history
        await this.loadMoreHistory();

        this.isReady = true;

        this.$nextTick(() => this.mountChart())
    }

    protected async loadMoreHistory ()
    {
        if (this.fullyLoaded) {
            return;
        }

        // requested stake pool
        const collection = await this.historyEntryService.getStakePoolHistoryCollection(
            this.stakePool.id,
            this.historyEntriesPagination
        );
        if (collection.items) {
            this.requestedHistoryEntries.unshift(...collection.items.reverse());
        }

        if (collection.total == this.requestedHistoryEntries.length) {
            this.fullyLoaded = true;
        }

        // avg entire network history
        {
            const collection = await this.historyEntryService.getStakePoolHistoryCollection(
                StakePool.SPECIAL_NETWORK_AVG_ID,
                this.historyEntriesPagination
            );
            if (collection.items) {
                this.specialAllHistoryEntries.unshift(...collection.items.reverse());
            }
        }

        // avg top100 history
        {
            const collection = await this.historyEntryService.getStakePoolHistoryCollection(
                StakePool.SPECIAL_TOP100_AVG_ID,
                this.historyEntriesPagination
            );
            if (collection.items) {
                this.specialTop100HistoryEntries.unshift(...collection.items.reverse());
            }
        }

        ++this.historyEntriesPagination.page;
    }

    protected mountChart()
    {
        // mount chart
        this.chart = LightweightCharts.createChart(this.$chartDiv, {
            width: this.$chartDiv.getBoundingClientRect().width,
            height: 400,
            layout: {
                backgroundColor: '#161616',
                textColor: '#d1d4dc',
            },
            grid: {
                vertLines: { color: 'rgba(42, 46, 57, 0.4)', },
                horzLines: { color: 'rgba(42, 46, 57, 0.6)', },
            },
            rightPriceScale: {},
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
            localization: {
                priceFormatter: (value) => Utility.formatPercent(value)
            }
        });

        this.requestedSeries = this.chart.addAreaSeries({
            lineColor: this.colors.requestAvgApr
        });
        this.specialAllSeries = this.chart.addLineSeries({
            color: this.colors.specialAll
        });
        this.specialTop100Series = this.chart.addLineSeries({
            color: this.colors.specialTop100
        });

        // refresh chart
        this.refreshChart();

        // auto loading
        const timeScale = this.chart.timeScale();

        let timer = null;
        timeScale.subscribeVisibleLogicalRangeChange(() => {
            if (timer !== null) {
                return;
            }
            timer = setTimeout(async() => {
                let logicalRange = timeScale.getVisibleLogicalRange();
                if (logicalRange !== null) {
                    var barsInfo = this.requestedSeries.barsInLogicalRange(logicalRange);
                    if (barsInfo !== null && barsInfo.barsBefore < 10) {
                        await this.loadMoreHistory();
                        await this.refreshChart();
                    }
                }
                timer = null;
            }, 50);
        });
    }

    protected refreshChart ()
    {
        {
            const data = this.requestedHistoryEntries
                .map(historyEntry => {
                    return {
                        time: historyEntry.entryDate.getTime() / 1000,
                        value: historyEntry.avgApr
                    };
                });
            this.requestedSeries.setData(data);
        }

        {
            const data = this.specialAllHistoryEntries
                .map(historyEntry => {
                    return {
                        time: historyEntry.entryDate.getTime() / 1000,
                        value: historyEntry.avgApr
                    };
                });
            this.specialAllSeries.setData(data);
        }

        {
            const data = this.specialTop100HistoryEntries
                .map(historyEntry => {
                    return {
                        time: historyEntry.entryDate.getTime() / 1000,
                        value: historyEntry.avgApr
                    };
                });
            this.specialTop100Series.setData(data);
        }
    }

}
</script>
