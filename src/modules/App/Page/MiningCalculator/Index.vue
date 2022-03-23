<template>
    <div class="g-page">
        <div class="g-container g-container--default">
            <Calculator />
        </div>
    </div>
</template>

<script lang="ts">
import Calculator from '#/App/Component/MiningCalculator/Calculator.vue';
import BaseComponent from '#/AppFrontend/Component/BaseComponent.vue';
import { Component, Route } from '#/AppFrontend/Vue/Annotations';


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
