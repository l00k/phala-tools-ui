<template>
    <div class="g-page">
        <div class="g-container g-container--default">
            <Calculator />
        </div>
    </div>
</template>

<script lang="ts">
import Calculator from '#/App/Component/AprCalculator/Calculator.vue';
import BaseComponent from '@inti5/app-frontend/Component/BaseComponent.vue';
import { Component, Route } from '@inti5/app-frontend/Vue/Annotations';


@Route('/aprcalc', 'apr_calc')
@Component({
    components: {
        Calculator
    }
})
export default class AprCalcIndexPage
    extends BaseComponent
{


}
</script>
