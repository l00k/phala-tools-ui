<template>
    <div class="card mb-4 holdings-view">
        <header class="card-header">
            <div class="card-header-title is-justify-content-space-between">
                <span>Stake pools</span>
                <span></span>
            </div>
        </header>
        <div class="card-content">

            <ui-table
                :data="stakePools"
                :loading="isLoading"
                :detailed="true"
                detail-key="id"
                :debounce-search="1000"
                :pagination.sync="pagination"
                ref="list"
            >
                <template slot-scope="{ row: holding }">
                    <ui-table-column
                        label="ID"
                        :numeric="true"
                        :filter-type="FilterType.Range"
                        :filter.sync="filters.onChainId"
                        :dom-style="{ width: '120px' }"
                    >
                        #{{ holding.onChainId }}
                    </ui-table-column>
                </template>
            </ui-table>

        </div>
    </div>
</template>

<script lang="ts">
import { SelectOptionMode } from '@inti5/app-frontend/Component/UI/FilterField/FilterSelect.vue';
import { FilterType } from '@inti5/app-frontend/Domain/Model/Filter';
import Pagination from '@inti5/app-frontend/Domain/Model/Pagination';
import { Component } from '@inti5/app-frontend/Vue/Annotations';
import BaseComponent from '@inti5/app-frontend/Component/BaseComponent.vue';
import { Inject } from '@inti5/object-manager';
import isEmpty from 'lodash/isEmpty';
import { Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';


declare const window;

const RuntimeStorage = namespace('StakePools/RuntimeStorage');

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
