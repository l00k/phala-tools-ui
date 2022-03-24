<template>
    <div>
        <b-loading
            :is-full-page="true"
            :active="!isReady"
            :can-cancel="false"
        />

        <div v-if="isReady">
<!--            <LoginWidget-->
<!--                v-if="!isLoggedIn"-->
<!--                :context.sync="context"-->
<!--                @ready=""-->
<!--            />-->

<!--            <Wizard-->
<!--                :context.sync="context"-->
<!--            />-->
        </div>
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

    protected isLoggedIn : boolean = false;


    public async mounted ()
    {
        await this.$store.dispatch('Watchdog/RuntimeStorage/init');

        this.isReady = true;
    }

}
</script>
