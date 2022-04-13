<template>
    <b-modal
        :active="true"
        :width="500"
    >
        <UiBlock
            title="Login"
            class="login-widget"
        >
            <div class="mb-4 is-flex is-align-items-stretch is-justify-content-space-between">
                <b-button
                    size="is-large"
                    class="is-discord"
                    @click="onDiscordLoginRequest"
                >
                    <i class="fab fa-discord"></i>
                    <span class="ml-4">Login with Discord</span>
                </b-button>

                <a
                    :href="discordConfig.serverInviteLink"
                    target="_blank"
                    class="ml-4 button is-discord server-link"
                >
                    <div>Join server</div>
                    <div class="has-text-weight-bold has-font-size-sm">To allow bot messaging!</div>
                </a>
            </div>

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

    @Config('modules.watchdog.discord')
    public discordConfig;

    @Config('modules.watchdog.telegram')
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

<style scoped lang="scss">
.login-widget {
    .panel-block {
        filter: grayscale(0.6);
    }
}

.button.is-discord {
    background: #5865F2;

    height: auto;
    flex-direction: column;

    &.server-link {
        flex-grow: 1;
    }

    &:focus:not(:active),
    &.is-focused:not(:active) {
        color: #fff;
        box-shadow: 0 0 0 0.125em rgb(255 255 255 / 25%)
    }
}
</style>
