<template>
    <div>
        <h1>Watchdog</h1>
    </div>
</template>

<script lang="ts">
import { BaseComponent } from '#/FrontendCore/Component';
import { Component } from '#/FrontendCore/Vue/Annotations';
import { namespace } from 'vuex-class';

const ClientStore = namespace('App/Client');
const RuntimeStorage = namespace('Watchdog/RuntimeStorage');


@Component({
    components: {
    }
})
export default class Calculator
    extends BaseComponent
{

    protected isReady : boolean = false;


    public async mounted ()
    {
        await this.$store.dispatch('Watchdog/RuntimeStorage/init');

        this.isReady = true;
    }

}
</script>
