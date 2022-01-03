import numbro from 'numbro';


export default {
    filters: {
        
        formatCoin (value : number)
        {
            return numbro(value).format('0.000 a');
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
