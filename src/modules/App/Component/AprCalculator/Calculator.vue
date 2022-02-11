<template>
    <div>
        <NetworkData
            :context.sync="context"
        />
    </div>
</template>

<script lang="ts">
import NetworkData from '#/App/Component/AprCalculator/Calculator/NetworkData.vue';
import { Context } from '#/App/Component/AprCalculator/Domain/Context';
import { StakePool } from '#/App/Domain/Model/StakePool';
import BaseComponent from '@/core/app-frontend/Component/BaseComponent.vue';
import { Component } from '@inti5/app-frontend/Vue/Annotations';
import { Inject } from '@inti5/object-manager';
import { Prop, Watch } from 'vue-property-decorator';


@Component({
    components: {
        NetworkData
    }
})
export default class Calculator
    extends BaseComponent
{

    protected context : Context = new Context();


    public mounted ()
    {
    }

    protected async loadNetworkData ()
    {


    }
}
</script>
