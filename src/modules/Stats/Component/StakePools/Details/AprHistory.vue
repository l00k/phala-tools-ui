<template>
    <div class="panel">
        <header class="panel-heading">
            <div class="panel-heading-title">
                <span>APR History</span>
            </div>
        </header>
        <div class="panel-block">
            <div v-if="!isReady">
                <b-skeleton height="500px" :animated="true" />
            </div>

            <div v-else>
                <div class="is-flex is-justify-content-start is-align-items-start">
                    <b-taglist attached class="mr-2">
                        <b-tag type="is-light">Pool avg APR</b-tag>
                        <b-tag :style="{ background: colors.requestAvgApr }">{{ requestedLastHistoryEntry?.avgApr | formatPercent }}</b-tag>
                    </b-taglist>

                    <b-taglist attached class="mr-2">
                        <b-tag type="is-dark">Pool current APR</b-tag>
                        <b-tag :style="{ background: colors.requestCurrentApr }">{{ requestedLastHistoryEntry?.currentApr | formatPercent }}</b-tag>
                    </b-taglist>

                    <b-taglist attached class="mr-2">
                        <b-tag type="is-light">All active pools avg APR</b-tag>
                        <b-tag :style="{ background: colors.specialAll }">{{ specialAllLastHistoryEntry?.avgApr | formatPercent }}</b-tag>
                    </b-taglist>

                    <b-taglist attached class="mr-2">
                        <b-tag type="is-light">TOP 100 active pools avg APR</b-tag>
                        <b-tag :style="{ background: colors.specialTop }">{{ specialTopLastHistoryEntry?.avgApr | formatPercent }}</b-tag>
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
import { Event, EventType } from '#/Stats/Domain/Model/Event';
import { StakePool } from '#/Stats/Domain/Model/StakePool';
import { HistoryEntry } from '#/Stats/Domain/Model/StakePool/HistoryEntry';
import { EventService } from '#/Stats/Domain/Service/EventService';
import { HistoryEntryService } from '#/Stats/Domain/Service/HistoryEntryService';
import * as Utility from '#/App/Utility';
import { StakePoolService } from '#/Stats/Domain/Service/StakePoolService';
import { Annotation as API } from '@/core/api-frontend';
import * as Api from '@/core/api-frontend';
import BaseComponent from '#/FrontendCore/Component/BaseComponent.vue';
import { Component } from '#/FrontendCore/Vue/Annotations';
import { Inject } from '@inti5/object-manager';
import Color from 'color';
import * as LightweightCharts from 'lightweight-charts';
import moment from 'moment';
import { Prop, Ref, Watch } from 'vue-property-decorator';


@Component()
export default class AprHistory
    extends BaseComponent
{


    @API.InjectService('stats')
    protected historyEntryService : HistoryEntryService;

    @API.InjectService('stats')
    protected eventService : EventService;

    @Prop()
    protected stakePool : StakePool;

    @Ref('chartDiv')
    protected $chartDiv : HTMLDivElement;


    protected isReady : boolean = false;

    protected chart : LightweightCharts.IChartApi;

    protected requestedHistoryEntries : HistoryEntry[] = [];
    protected requestedAvgSeries : LightweightCharts.ISeriesApi<any>;
    protected requestedCurrentSeries : LightweightCharts.ISeriesApi<any>;

    protected specialAllHistoryEntries : HistoryEntry[] = [];
    protected specialAllSeries : LightweightCharts.ISeriesApi<any>;

    protected specialTopHistoryEntries : HistoryEntry[] = [];
    protected specialTopSeries : LightweightCharts.ISeriesApi<any>;

    protected events : Event<any>[] = [];
    protected eventsSeries : any;

    protected colors = {
        requestAvgApr: '#33d778',
        requestCurrentApr: '#33d778',
        specialAll: '#2ca4df',
        specialTop: '#447ec6',
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

    public get specialTopLastHistoryEntry () : HistoryEntry
    {
        return this.specialTopHistoryEntries.length
            ? this.specialTopHistoryEntries[this.specialTopHistoryEntries.length - 1]
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

        // avg entire network history
        this.specialAllHistoryEntries = [];
        for await (const items of this.historyEntryService.getStakePoolHistoryFetcher(StakePool.SPECIAL_NETWORK_AVG_ID)) {
            this.specialAllHistoryEntries.unshift(...items.reverse());
        }

        // avg top history
        this.specialTopHistoryEntries = [];
        for await (const items of this.historyEntryService.getStakePoolHistoryFetcher(StakePool.SPECIAL_TOP_AVG_ID)) {
            this.specialTopHistoryEntries.unshift(...items.reverse());
        }

        // events
        const filters : Api.Domain.Filters<Event<any>> = {
            type: {
                $in: [ EventType.CommissionChange, EventType.Halving, EventType.BadBehavior ]
            }
        };

        this.events = [];
        for await (const items of this.eventService.getStakePoolEventsFetcher(this.stakePool.id, filters)) {
            this.events.push(...items);
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
            rightPriceScale: {},
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
            localization: {
                priceFormatter: (value) => Utility.formatPercent(value)
            }
        });

        this.specialAllSeries = this.chart.addLineSeries({
            color: this.colors.specialAll,
        });
        this.specialTopSeries = this.chart.addLineSeries({
            color: this.colors.specialTop,
        });
        this.requestedAvgSeries = this.chart.addAreaSeries({
            lineColor: this.colors.requestAvgApr,
            topColor: Color(this.colors.requestAvgApr).alpha(0.4).toString(),
            bottomColor: Color(this.colors.requestAvgApr).alpha(0).toString(),
        });
        this.requestedCurrentSeries = this.chart.addAreaSeries({
            lineColor: this.colors.requestCurrentApr,
            topColor: Color(this.colors.requestCurrentApr).alpha(0.1).toString(),
            bottomColor: Color(this.colors.requestCurrentApr).alpha(0).toString(),
            lineWidth: 1,
            lineStyle: LightweightCharts.LineStyle.Dashed,
        });

        // refresh chart
        this.refreshChart();
    }

    protected refreshChart ()
    {
        {
            const data = this.requestedHistoryEntries
                .map(historyEntry => ({
                    time: historyEntry.entryDate.getTime() / 1000,
                    value: historyEntry.avgApr
                }));
            this.requestedAvgSeries.setData(data);
        }
        {
            const data = this.requestedHistoryEntries
                .map(historyEntry => ({
                    time: historyEntry.entryDate.getTime() / 1000,
                    value: historyEntry.currentApr
                }));
            this.requestedCurrentSeries.setData(data);
        }

        {
            const data = this.specialAllHistoryEntries
                .map(historyEntry => ({
                    time: historyEntry.entryDate.getTime() / 1000,
                    value: historyEntry.avgApr
                }));
            this.specialAllSeries.setData(data);
        }

        {
            const data = this.specialTopHistoryEntries
                .map(historyEntry => ({
                    time: historyEntry.entryDate.getTime() / 1000,
                    value: historyEntry.avgApr
                }));
            this.specialTopSeries.setData(data);
        }

        // get events
        const markers : LightweightCharts.SeriesMarker<LightweightCharts.Time>[] = [];

        for (const event of this.events) {
            let timestamp = moment(event.blockDate)
                .minute(0)
                .second(0);
            timestamp = timestamp.hour(Math.floor(timestamp.hour()));

            if (event.type == EventType.CommissionChange) {
                const text = 'Commission: '
                    + Utility.formatPercent(event.additionalData.commission, { output: 'percent', mantissa: 0 }) + ' ('
                    + Utility.formatPercent(event.additionalData.delta, {
                        output: 'percent',
                        mantissa: 0,
                        forceSign: true
                    }) + ')';
                markers.push({
                    time: <any>timestamp.unix(),
                    size: 2,
                    position: 'aboveBar',
                    shape: event.additionalData.delta > 0 ? 'arrowUp' : 'arrowDown',
                    color: event.additionalData.delta > 0 ? 'red' : 'green',
                    text
                });
            }
            else if (event.type == EventType.Halving) {
                markers.push({
                    time: <any>timestamp.unix(),
                    size: 2,
                    position: 'belowBar',
                    shape: 'square',
                    color: '#5492b0',
                    text: 'Halving'
                });
            }
            else if (event.type == EventType.BadBehavior) {
                markers.push({
                    time: <any>timestamp.unix(),
                    size: 2,
                    position: 'belowBar',
                    shape: 'circle',
                    color: '#ff0000',
                    text: 'Bad behavior'
                });
            }
        }

        this.requestedCurrentSeries.setMarkers(markers);
    }

}
</script>
