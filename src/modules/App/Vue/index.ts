import * as Utility from '#/App/Utility';
import * as Polkadot from '#/Polkadot';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTowerObservation } from '@fortawesome/free-solid-svg-icons';
import { extend } from 'vee-validate';
import Vue from 'vue';
import VueTour from 'vue-tour';

Vue.use(VueTour);

Vue.component('Identicon', require('@polkadot/vue-identicon').default);

Vue.filter('getSubscanAccountUrl', Utility.getSubscanAccountUrl);
Vue.filter('formatNumber', Utility.formatNumber);
Vue.filter('formatPercent', Utility.formatPercent);
Vue.filter('formatCoin', Utility.formatCoin);
Vue.filter('unformatCoin', Utility.unformatCoin);
Vue.filter('formatAddress', Utility.formatAddress);
Vue.filter('formatPublicKey', Utility.formatPublicKey);

library.add(
    faTowerObservation
);

extend('isPolkadotAddress', {
    validate (value, params : any[]) {
        const prefix = params.length > 0
            ? params[0]
            : undefined;
        return Polkadot.Utility.isAddress(value, prefix);
    },
    message: '{_field_} is not proper address'
});
