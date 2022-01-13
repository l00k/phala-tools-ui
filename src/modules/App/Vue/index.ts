import * as Utility from '#/App/Utility';
import Identicon from '@polkadot/vue-identicon';

export default {
    components: {
        Identicon
    },
    filters: {
        ...Utility
    }
};
