<template>
    <div class="g-page">
        <div class="g-container g-container--default">
            <Watchdog />
        </div>
    </div>
</template>

<script lang="ts">
import BaseComponent from '#/FrontendCore/Component/BaseComponent.vue';
import { Component, Route } from '#/FrontendCore/Vue/Annotations';
import Watchdog from '#/Watchdog/Component/Watchdog.vue';


@Route('/watchdog', 'watchdog')
@Component({
    components: {
        Watchdog
    }
})
export default class WatchdogIndexPage
    extends BaseComponent
{

    public async mounted ()
    {

    }

}
</script>
