<template>
    <ui-block
        class="m-panel"
        title="Search"
    >
        <template>
            <b-field label="Add account" label-position="on-border">
                <b-autocomplete
                    :data="filteredAccounts"
                    placeholder="Type address or identity name"
                    icon="search"
                    @typing="onAccountsFilter"
                    @select="account => $emit('pick-account', account)"
                >
                    <template #empty>No results found</template>
                    <template #default="{ option }">
                        <div v-if="option.name" class="has-text-weight-bold">{{ option.name }}</div>
                        <div>{{ option.address }}</div>
                    </template>
                </b-autocomplete>
            </b-field>

            <b-field label="Add stake pool" label-position="on-border">
                <b-autocomplete
                    :data="filteredStakePools"
                    placeholder="Type number or owner details"
                    icon="search"
                    @typing="onStakePoolsFilter"
                    @select="stakePool => $emit('pick-stakepool', stakePool)"
                >
                    <template #empty>No results found</template>
                    <template #default="{ option }">
                        <div class="has-text-weight-bold">#{{ option.onChainId }}</div>
                    </template>
                </b-autocomplete>
            </b-field>
        </template>
    </ui-block>
</template>

<script lang="ts">
import { Component } from '@inti5/app-frontend/Vue/Annotations';
import BaseComponent from '@inti5/app-frontend/Component/BaseComponent.vue';
import Debounce from '@inti5/utils/Debounce';
import { Prop } from 'vue-property-decorator';
import { Account, StakePool } from '#/Analyze/Domain/Definition';

@Component({
    components: {}
})
export default class Panel
    extends BaseComponent
{

    @Prop()
    protected accounts : { [key: number]: Account };

    @Prop()
    protected stakePools : { [key: number]: StakePool };

    protected filteredAccounts : Account[] = [];

    protected filteredStakePools : StakePool[] = [];


    @Debounce(500)
    public onAccountsFilter(term : string)
    {
        const lTerm = term.toLowerCase();
        this.filteredAccounts = Object.values(this.accounts)
            .filter(entry => {
                return entry.address.toLowerCase().includes(lTerm)
                    //|| entry.alias?.toLowerCase().includes(lTerm)
                    || entry.name?.toLowerCase().includes(lTerm)
                    ;
            });
    }

    @Debounce(500)
    public onStakePoolsFilter(term : string)
    {
        const lTerm = term.toLowerCase();
        this.filteredStakePools = Object.values(this.stakePools)
            .filter(entry => {
                const owner = this.accounts[entry.ownerId];
                return String(entry.onChainId).includes(lTerm)
                    || owner.address.toLowerCase().includes(lTerm)
                    //|| entry.alias?.toLowerCase().includes(lTerm)
                    || owner.name?.toLowerCase().includes(lTerm)
                    ;
            });
    }

}
</script>

<style scoped lang="scss">
.m-panel {
}
</style>
