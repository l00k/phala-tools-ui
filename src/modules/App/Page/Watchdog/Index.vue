<template>
    <div class="g-page">
        <div class="g-container g-container--default">

        </div>
    </div>
</template>

<script lang="ts">

import BaseComponent from '@inti5/app-frontend/Component/BaseComponent.vue';
import { Component, Route } from '@inti5/app-frontend/Vue/Annotations';


@Route('/watchdog', 'watchdog')
@Component({
    components: {

    }
})
export default class MiningCalculatorPage
    extends BaseComponent
{


}
</script>
