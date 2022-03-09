import * as Utility from '#/App/Utility';
import Vue from 'vue';


Vue.component('Identicon', require('@polkadot/vue-identicon').default);


Vue.filter('getSubscanAccountUrl', Utility.getSubscanAccountUrl);
Vue.filter('formatNumber', Utility.formatNumber);
Vue.filter('formatPercent', Utility.formatPercent);
Vue.filter('formatCoin', Utility.formatCoin);
Vue.filter('unformatCoin', Utility.unformatCoin);
Vue.filter('formatAddress', Utility.formatAddress);
Vue.filter('formatPublicKey', Utility.formatPublicKey);
