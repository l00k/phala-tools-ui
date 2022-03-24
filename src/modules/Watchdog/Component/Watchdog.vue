<template>
    <div>
        <b-loading
            :is-full-page="true"
            :active="!isReady"
            :can-cancel="false"
        />

        <div v-if="isReady">
            <LoginWidget
                v-if="!isLoggedIn"
            />

            <UserPanel
                v-if="isLoggedIn"
            />


        </div>
    </div>
</template>

<script lang="ts">
import { BaseComponent } from '#/FrontendCore/Component';
import { Component } from '#/FrontendCore/Vue/Annotations';
import { namespace } from 'vuex-class';
import LoginWidget from '#/Watchdog/Component/Watchdog/LoginWidget.vue';
import UserPanel from '#/Watchdog/Component/Watchdog/UserPanel.vue';

const RuntimeStorage = namespace('Watchdog/RuntimeStorage');


@Component({
    components: {
        LoginWidget,
        UserPanel,
    }
})
export default class Watchdog
    extends BaseComponent
{

    protected isReady : boolean = false;

    @RuntimeStorage.State('isLoggedIn')
    protected isLoggedIn : boolean;


    public async mounted ()
    {
        await this.$store.dispatch('Watchdog/RuntimeStorage/init');

        this.isReady = true;
    }

}
</script>
