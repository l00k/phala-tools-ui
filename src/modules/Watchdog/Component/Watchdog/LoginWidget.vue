<template>
    <b-modal
        :active="true"
        :width="400"
    >
        <UiBlock
            title="Login"
            class="login-widget"
        >
            <b-button
                size="is-large"
                expanded
                class="is-discord mb-4"
                @click="onDiscordLoginRequest"
            >
                <i class="fab fa-discord"></i>
                <span class="ml-4">Login using Discord</span>
            </b-button>

            <div ref="telegramWidget"></div>
        </UiBlock>
    </b-modal>
</template>

<script lang="ts">
import { BaseComponent } from '#/FrontendCore/Component';
import { Component } from '#/FrontendCore/Vue/Annotations';
import { Config } from '@inti5/configuration';
import { Ref } from 'vue-property-decorator';
import camelCase from 'lodash/camelCase';


@Component()
export default class LoginWidget
    extends BaseComponent
{

    @Config('module.watchdog.login.discord')
    public discordConfig;

    @Config('module.watchdog.login.telegram')
    public telegramConfig;

    @Ref('telegramWidget')
    public $telegramWidget : HTMLDivElement;


    public mounted()
    {
        // telegram
        const telegramScript = document.createElement('script');
        telegramScript.setAttribute('src', 'https://telegram.org/js/telegram-widget.js?18');
        telegramScript.setAttribute('data-telegram-login', this.telegramConfig.botName);
        telegramScript.setAttribute('data-size', 'large');
        telegramScript.setAttribute('data-radius', '2');
        telegramScript.setAttribute('data-onauth', 'onTelegramAuth(user)');
        telegramScript.setAttribute('data-request-access', 'write');

        this.$telegramWidget.appendChild(telegramScript);

        (<any>window).onTelegramAuth = this.onTelegramLogin.bind(this);
    }

    public onTelegramLogin(userData)
    {
        const preparedData : any = Object.fromEntries(
            Object.entries(userData)
                .map(([ key, value ]) => [ camelCase(key), value ])
        );

        this.$router.push({
            name: 'watchdog_logged_telegram',
            query: preparedData,
        });
    }

    public onDiscordLoginRequest()
    {
        document.location.href = this.discordConfig.authUrl;
    }

}
</script>

<style lang="scss">
.login-widget {
    .panel-block {
        filter: grayscale(0.6);
    }
}

.is-discord {
    background: #5865F2;
}
</style>
