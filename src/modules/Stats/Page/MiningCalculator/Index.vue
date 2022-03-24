<template>
    <div class="g-page">
        <div class="g-container g-container--default">
            <Calculator />
        </div>
    </div>
</template>

<script lang="ts">
import Calculator from '#/Stats/Component/MiningCalculator/Calculator.vue';
import BaseComponent from '#/FrontendCore/Component/BaseComponent.vue';
import { Component, Route } from '#/FrontendCore/Vue/Annotations';


@Route('/mining-calc', 'mining_calc')
@Component({
    components: {
        Calculator
    }
})
export default class MiningCalculatorIndexPage
    extends BaseComponent
{


}
</script>
