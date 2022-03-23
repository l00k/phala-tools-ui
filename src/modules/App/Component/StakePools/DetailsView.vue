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
import AprHistory from '#/App/Component/StakePools/Details/AprHistory.vue';
import BasicInfo from '#/App/Component/StakePools/Details/BasicInfo.vue';
import StakingHistory from '#/App/Component/StakePools/Details/StakingHistory.vue';
import { StakePool } from '#/App/Domain/Model/StakePool';
import { StakePoolService } from '#/App/Domain/Service/StakePoolService';
import BaseComponent from '#/FrontendCore/Component/BaseComponent.vue';
import { Component } from '#/FrontendCore/Vue/Annotations';
import { Inject } from '@inti5/object-manager';
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

    @Inject()
    protected stakePoolService : StakePoolService;

    @Prop({ default: null })
    public stakePoolId : number;

    public isReady : boolean = false;
    public stakePool : StakePool = null;


    public mounted ()
    {
        this.loadView();
    }

    @Watch('stakePoolId')
    protected async loadView ()
    {
        this.isReady = false;
        this.stakePool = await this.stakePoolService.getItem(this.stakePoolId);
        this.isReady = true;
    }
}
</script>
