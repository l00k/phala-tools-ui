<template>
    <div class="panel is-primary">
        <header class="panel-heading">
            <div class="panel-heading-title is-justify-content-space-between">
                <span>
                    Wizard
                </span>
            </div>
        </header>
        <div class="panel-block">

            <div class="box">
                <h2 class="title is-6">Pick device</h2>


            </div>

        </div>
    </div>
</template>

<script lang="ts">
import { Context } from '#/App/Component/AprCalculator/Domain/Context';
import BaseComponent from '@inti5/app-frontend/Component/BaseComponent.vue';
import { Component } from '@inti5/app-frontend/Vue/Annotations';
import { Prop } from 'vue-property-decorator';


@Component()
export default class BasicInfo
    extends BaseComponent
{

    @Prop()
    protected context : Context;


}
</script>

<style lang="scss">

</style>
