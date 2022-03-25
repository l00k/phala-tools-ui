<template>
    <div>
        <b-loading
            :is-full-page="true"
            :active="true"
            :can-cancel="false"
        />
    </div>
</template>

<script lang="ts">
import BaseComponent from '#/FrontendCore/Component/BaseComponent.vue';
import { Component, Route } from '#/FrontendCore/Vue/Annotations';
import * as VueRouter from 'vue-router';
import * as Api from '@inti5/api-frontend';
import { Annotation as API } from '@inti5/api-frontend';


@Route('/watchdog/login/discord', 'watchdog_logged_discord')
@Route('/watchdog/login/telegram', 'watchdog_logged_telegram')
@Component()
export default class WatchdogLoginPage
    extends BaseComponent
{

    @API.InjectClient('watchdog')
    protected apiClient : Api.Client;


    public mounted()
    {
        this.checkLogin();
    }

    protected async checkLogin ()
    {
        const isLoggedIn = this.$store.state['Watchdog/RuntimeStorage'].isLoggedIn;
        if (isLoggedIn) {
            this.$router.push({ name: 'watchdog' });
            return;
        }

        if (this.$route.name == 'watchdog_logged_discord') {
            await this.tryToLoginUsingDiscord();
        }
        else if (this.$route.name == 'watchdog_logged_telegram') {
            await this.tryToLoginUsingTelegram();
        }

        this.$router.push({ name: 'watchdog' });
    }

    protected async tryToLoginUsingDiscord()
    {
        if (!this.$route.query.code) {
            this.$buefy.toast.open({
                message: 'Unable to login',
                type: 'is-danger',
            });
            return;
        }

        const { status, data } = await this.apiClient.post('/login/discord', {
            code: this.$route.query.code,
        });
        if (status !== 200 || !data) {
            this.$buefy.toast.open({
                message: 'Unable to login',
                type: 'is-danger',
            });
            return;
        }

        this.apiClient.setTokens(data.accessToken, data.refreshToken);
    }

    protected async tryToLoginUsingTelegram()
    {
        if (!this.$route.query.id) {
            this.$buefy.toast.open({
                message: 'Unable to login',
                type: 'is-danger',
            });
            return;
        }

        const { status, data } = await this.apiClient.post(
            '/login/telegram',
            this.$route.query
        );
        if (status !== 200 || !data) {
            this.$buefy.toast.open({
                message: 'Unable to login',
                type: 'is-danger',
            });
            return;
        }

        this.apiClient.setTokens(data.accessToken, data.refreshToken);
    }

}
</script>
