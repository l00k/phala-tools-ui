import { Account } from '#/App/Domain/Model/Account';
import numbro from 'numbro';


export default {
    filters: {
        getSubscanAccountUrl (account : Account)
        {
            return `https://khala.subscan.io/account/${account?.address}`;
        },
        
        formatCoin (value : number)
        {
            return numbro(value).format('0.000 a');
        },
        
        formatAddress (value)
        {
            if (!value) {
                return '';
            }
            return value.substr(0, 10) + '...' + value.substr(-10);
        }
        
    }
};
