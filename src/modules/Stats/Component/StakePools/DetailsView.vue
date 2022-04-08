<template>
    <div>
        <BasicInfo
            :stake-pool-entry="stakePoolEntry"
        />
        <AprHistory
            :stake-pool-entry="stakePoolEntry"
        />
        <StakingHistory
            :stake-pool-entry="stakePoolEntry"
        />
    </div>
</template>

<script lang="ts">
import BaseComponent from '#/FrontendCore/Component/BaseComponent.vue';
import { Component } from '#/FrontendCore/Vue/Annotations';
import AprHistory from '#/Stats/Component/StakePools/Details/AprHistory.vue';
import BasicInfo from '#/Stats/Component/StakePools/Details/BasicInfo.vue';
import StakingHistory from '#/Stats/Component/StakePools/Details/StakingHistory.vue';
import { StakePoolEntry } from '#/Stats/Domain/Model/StakePoolEntry';
import { StakePoolEntryService } from '#/Stats/Domain/Service/StakePoolEntryService';
import { Annotation as API } from '@inti5/api-frontend';
import { Prop, Watch } from 'vue-property-decorator';


@Component({
    components: {
        StakingHistory,
        AprHistory,
        BasicInfo
    }
})
export default class DetailsView
    extends BaseComponent
{

    @API.InjectService()
    protected _stakePoolService : StakePoolEntryService;

    @Prop({ default: null })
    public stakePoolEntryId : number;

    public isReady : boolean = false;

    public stakePoolEntry : StakePoolEntry = null;


    public mounted ()
    {
        this._loadView();
    }

    @Watch('stakePoolEntryId')
    protected async _loadView ()
    {
        this.isReady = false;
        this.stakePoolEntry = await this._stakePoolService.getItem(this.stakePoolEntryId);
        this.isReady = true;
    }
}
</script>
