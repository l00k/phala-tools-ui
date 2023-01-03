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
import { API } from '@inti5/api-frontend';


@Route('/watchdog/login/discord', 'watchdog_logged_discord')
@Route('/watchdog/login/telegram', 'watchdog_logged_telegram')
@Component()
export default class WatchdogLoginPage
    extends BaseComponent
{

    @API.InjectClient()
    protected _apiClient : Api.Client;


    public mounted()
    {
        this._checkLogin();
    }

    protected async _checkLogin ()
    {
        const isLoggedIn = this.$store.state['Watchdog/RuntimeStorage'].isLoggedIn;
        if (isLoggedIn) {
            this.$router.push({ name: 'watchdog' });
            return;
        }

        if (this.$route.name == 'watchdog_logged_discord') {
            await this._tryToLoginUsingDiscord();
        }
        else if (this.$route.name == 'watchdog_logged_telegram') {
            await this._tryToLoginUsingTelegram();
        }

        setTimeout(() => {
            document.location.href = '/watchdog';
        }, 2500);
    }

    protected async _tryToLoginUsingDiscord()
    {
        if (!this.$route.query.code) {
            this.$buefy.toast.open({
                message: 'Unable to login',
                type: 'is-danger',
            });
            return;
        }

        const { status, data } = await this._apiClient.post('/login/discord', {
            code: this.$route.query.code,
        });
        if (status !== 200 || !data) {
            this.$buefy.toast.open({
                message: 'Unable to login',
                type: 'is-danger',
            });
            return;
        }

        this._apiClient.setTokens(data.accessToken, data.refreshToken);
    }

    protected async _tryToLoginUsingTelegram()
    {
        if (!this.$route.query.id) {
            this.$buefy.toast.open({
                message: 'Unable to login',
                type: 'is-danger',
            });
            return;
        }

        const { status, data } = await this._apiClient.post(
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

        this._apiClient.setTokens(data.accessToken, data.refreshToken);
    }

}
</script>
