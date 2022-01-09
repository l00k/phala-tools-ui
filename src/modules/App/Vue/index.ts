import { Account } from '#/App/Domain/Model/Account';
import numbro from 'numbro';


export default {
    filters: {
        getSubscanAccountUrl (account : Account)
        {
            return `https://khala.subscan.io/account/${account?.address}`;
        },
        
        formatCoin (value : number, format : numbro.Format = {})
        {
            return numbro(value).format({
                thousandSeparated: true,
                mantissa: 2,
                ...format
            });
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
