<template>
    <div>
        <b-loading
            :is-full-page="true"
            :active="!isReady"
            :can-cancel="false"
        />

        <div v-if="isReady">
            <div v-if="isLoggedIn">
                <UserPanel/>
                <WatchdogConfiguration/>
            </div>
            <div v-else>
                <LoginWidget
                    v-if="!isLoggedIn"
                />
            </div>

        </div>
    </div>
</template>

<script lang="ts">
import { BaseComponent } from '#/FrontendCore/Component';
import { Component } from '#/FrontendCore/Vue/Annotations';
import { namespace } from 'vuex-class';
import LoginWidget from '#/Watchdog/Component/Watchdog/LoginWidget.vue';
import UserPanel from '#/Watchdog/Component/Watchdog/UserPanel.vue';
import WatchdogConfiguration from './Watchdog/WatchdogConfiguration.vue';

const RuntimeStorage = namespace('Watchdog/RuntimeStorage');


@Component({
    components: {
        LoginWidget,
        UserPanel,
        WatchdogConfiguration,
    }
})
export default class Watchdog
    extends BaseComponent
{

    public isReady : boolean = false;

    @RuntimeStorage.State('isLoggedIn')
    public isLoggedIn : boolean;


    public async mounted ()
    {
        await this.$store.dispatch('Watchdog/RuntimeStorage/init');
        this.isReady = true;
    }

}
</script>
