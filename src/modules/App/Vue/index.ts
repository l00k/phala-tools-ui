import Decimal from 'decimal.js';
import numbro from 'numbro';


export default {
    filters: {
        
        formatCoin (value : Decimal)
        {
            return numbro(value.toNumber()).format('0.000 a');
        },
        
        formatAddress (value)
        {
            if (!value) {
                return '';
            }
            return value.substr(0, 6) + '...' + value.substr(-6);
        }
        
    }
};
