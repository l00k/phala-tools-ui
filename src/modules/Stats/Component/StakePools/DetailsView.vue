<template>
    <div>
        <BasicInfo
            :stake-pool="stakePool"
        />
        <AprHistory
            :stake-pool="stakePool"
        />
        <StakingHistory
            :stake-pool="stakePool"
        />
    </div>
</template>

<script lang="ts">
import BaseComponent from '#/FrontendCore/Component/BaseComponent.vue';
import { Component } from '#/FrontendCore/Vue/Annotations';
import AprHistory from '#/Stats/Component/StakePools/Details/AprHistory.vue';
import BasicInfo from '#/Stats/Component/StakePools/Details/BasicInfo.vue';
import StakingHistory from '#/Stats/Component/StakePools/Details/StakingHistory.vue';
import { StakePool } from '#/Stats/Domain/Model/StakePool';
import { StakePoolService } from '#/Stats/Domain/Service/StakePoolService';
import { Annotation as API } from '@/core/api-frontend';
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

    @API.InjectService('stats')
    protected _stakePoolService : StakePoolService;

    @Prop({ default: null })
    public stakePoolId : number;

    public isReady : boolean = false;

    public stakePool : StakePool = null;


    public mounted ()
    {
        this._loadView();
    }

    @Watch('stakePoolId')
    protected async _loadView ()
    {
        this.isReady = false;
        this.stakePool = await this._stakePoolService.getItem(this.stakePoolId);
        this.isReady = true;
    }
}
</script>
