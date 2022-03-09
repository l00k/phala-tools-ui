<template>
    <div class="g-page">
        <div class="g-container g-container--default">
            <Calculator />
        </div>
    </div>
</template>

<script lang="ts">
import Calculator from '#/App/Component/MiningCalculator/Calculator.vue';
import BaseComponent from '@inti5/app-frontend/Component/BaseComponent.vue';
import { Component, Route } from '@inti5/app-frontend/Vue/Annotations';


@Route('/mining-calc', 'mining_calc')
@Component({
    components: {
        Calculator
    }
})
export default class MiningCalculatorPage
    extends BaseComponent
{


}
</script>
