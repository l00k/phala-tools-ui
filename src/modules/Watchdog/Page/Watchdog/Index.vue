<template>
    <div class="g-page">
        <div class="g-container g-container--default">
            <Watchdog />
        </div>
    </div>
</template>

<script lang="ts">
import Watchdog from '#/Watchdog/Component/Watchdog.vue';
import BaseComponent from '#/FrontendCore/Component/BaseComponent.vue';
import { Component, Route } from '#/FrontendCore/Vue/Annotations';
import { InitializeSymbol, Inject } from '@inti5/object-manager';
import * as Api from '@/core/api-frontend';


@Route('/watchdog', 'watchdog')
@Component({
    components: {
        Watchdog
    }
})
export default class WatchdogIndexPage
    extends BaseComponent
{

    @Inject()
    protected apiProvider : Api.Provider;


    public mounted ()
    {
        // todo ld 2022-03-24 15:12:33
        this.apiProvider.get('watchdog')
            .setTokens(
                'aaa',
                'bbb'
            );
    }


}
</script>
