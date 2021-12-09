<template>
    <div class="card mb-4 holdings-view">
        <header class="card-header">
            <div class="card-header-title is-justify-content-space-between">
                <span>Stake pools</span>
                <span></span>
            </div>
        </header>
        <div class="card-content">

<!--            <ui-table-->
<!--                :data="holdings"-->
<!--                :loading="isLoading"-->
<!--                :detailed="true"-->
<!--                detail-key="id"-->
<!--                :show-detail-icon="false"-->
<!--                :opened-detailed="openedDetails"-->
<!--                :debounce-search="1000"-->
<!--                :pagination.sync="pagination"-->
<!--                ref="holders"-->
<!--            >-->
<!--                <template slot-scope="{ row: holding }">-->
<!--                    <ui-table-column-->
<!--                        label="Rank"-->
<!--                        :numeric="true"-->
<!--                        :filter-type="FilterType.Range"-->
<!--                        :filter.sync="filters.rank"-->
<!--                        :dom-style="{ width: '120px' }"-->
<!--                    >-->
<!--                        {{ holding.rank }}-->
<!--                    </ui-table-column>-->

<!--                    <ui-table-column-->
<!--                        label="Address"-->
<!--                        :filter.sync="filters.account.address"-->
<!--                    >-->
<!--                        <div class="has-font-size-sm">{{ holding.account.address }}</div>-->
<!--                        <a-->
<!--                            v-if="holding.account.name"-->
<!--                            href="#!/show"-->
<!--                            class="has-text-weight-bold is-primary"-->
<!--                        >{{ holding.account.name }}</a>-->
<!--                    </ui-table-column>-->

<!--                    <ui-table-column-->
<!--                        label="Tags"-->
<!--                        :filter-type="FilterType.Select"-->
<!--                        :filter-config="{ options: tagOptions }"-->
<!--                        :filter.sync="filters.account.tags.id"-->
<!--                    >-->
<!--                        <b-tag-->
<!--                            v-for="tag in holding.account.tags"-->
<!--                            :key="tag.id"-->
<!--                            class="mr-1"-->
<!--                            size="is-micro"-->
<!--                            :style="{ background: tag.color }"-->
<!--                        >{{ tag.label }}-->
<!--                        </b-tag>-->
<!--                    </ui-table-column>-->

<!--                    <ui-table-column-->
<!--                        label="Balance"-->
<!--                        :numeric="true"-->
<!--                        :filter-config="{ numberFormat: '0.000 a' }"-->
<!--                        :filter.sync="filters.balance"-->
<!--                        :dom-style="{ width: '150px' }"-->
<!--                    >-->
<!--                        {{ holding.balance | formatCoin(selectedToken) }}-->
<!--                    </ui-table-column>-->

<!--                    <ui-table-column-->
<!--                        label="Share"-->
<!--                        :numeric="true"-->
<!--                        :filter-config="{ numberFormat: '0.0000 %' }"-->
<!--                        :filter.sync="filters.share"-->
<!--                        :dom-style="{ width: '150px' }"-->
<!--                    >-->
<!--                        {{ holding.share | formatNumber('0.0000 %') }}-->
<!--                    </ui-table-column>-->
<!--                </template>-->

<!--                <template v-slot:detail="{ row: holding }">-->
<!--                    <TransactionHistoryView-->
<!--                        :token="selectedToken"-->
<!--                        :holding="holding"-->
<!--                        :params="params"-->
<!--                        :key="holding.id"-->
<!--                    />-->
<!--                </template>-->
<!--            </ui-table>-->

        </div>
    </div>
</template>

<script lang="ts">
import { SelectOptionMode } from '#/Core/Component/UI/FilterField/FilterSelect.vue';
import { FilterType } from '#/Core/Domain/Model/Filter';
import { Pagination } from '@/intiv/core/GraphQL/Struct';
import { Component } from '@/intiv/core/Vue/Annotations';
import BaseComponent from '@/intiv/core/Vue/BaseComponent.vue';
import { Inject } from '@/intiv/utils/ObjectManager';
import isEmpty from 'lodash/isEmpty';
import { Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';


declare const window;

const Storage = namespace('StakePools/Storage');

@Component({
    components: {
    }
})
export default class ListView
    extends BaseComponent
{

}
</script>

<style lang="scss">
@import "@/assets/scss/theme/_variables";

</style>
