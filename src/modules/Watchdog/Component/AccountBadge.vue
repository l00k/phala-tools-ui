<template>
    <div
        v-if="account"
        class="is-flex is-flex-direction-row is-align-items-center"
    >
        <Identicon
            :size="32"
            theme="substrate"
            :value="account.address"
        />
        <div class="ml-3">
            <div
                :class="{ 'has-font-size-sm': account.identity }"
            >{{ account.address }}</div>
            <div
                v-if="account.identity"
                :class="{ 'has-color-primary': account.identityVerified }"
            >{{ account.identity }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { BaseComponent } from '#/FrontendCore/Component';
import { Component } from '#/FrontendCore/Vue/Annotations';
import { Account } from '#/Phala/Domain/Model';
import { Prop } from 'vue-property-decorator';

@Component()
export default class AccountBadge
    extends BaseComponent
{

    @Prop()
    public account : Account;

}
</script>
