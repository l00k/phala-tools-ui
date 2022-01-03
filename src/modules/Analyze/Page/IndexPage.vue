<template>
    <div class="g-page">

        <div class="columns justify-spece-between">
            <div
                v-if="isReady"
                class="column is-12"
            >
                <NetworkMapView/>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import { Route, Component } from '@inti5/app-frontend/Vue/Annotations';
import BaseComponent from '@inti5/app-frontend/Vue/BaseComponent.vue';
import NetworkMapView from '#/Analyze/Component/NetworkMapView.vue';
import { namespace } from 'vuex-class';


const ConfigStore = namespace('Dapp/Config');

@Route('/network-map', 'dapp')
@Component({
    components: {
        NetworkMapView,
    }
})
export default class IndexPage
    extends BaseComponent
{

    public isReady : boolean = false;

    public async mounted()
    {
        await this.$store.dispatch('Analyze/Storage/init');

        this.isReady = true;
    }

}
</script>
