import numbro from 'numbro';
import moment from 'moment';
import * as Phala from '#/Phala';


export class Utility
{
    
    public static readonly TOKEN_TICKER = 'PHA';
    
    
    public static formatNumber (amount : number) : string
    {
        return numbro(amount).format('0.000 a');
    }
    
    public static formatPercent (percent : number) : string
    {
        return numbro(percent).format('0.00%');
    }
    
    public static formatCoin (amount : number, ticker : boolean = false, isInRawFormat : boolean = false) : string
    {
        if (isInRawFormat) {
            amount = Phala.Utility.parseRawAmount(amount);
        }
    
        const parts = this.formatNumber(amount).split(' ');
        if (parts.length == 1) {
            parts[1] = ' ';
        }
        
        return parts.join(' ') + (ticker ? Utility.TOKEN_TICKER : '');
    }
    
    public static unformatCoin (amountRaw : any) : number
    {
        return numbro.unformat(amountRaw, '0.000a');
    }
    
    public static formatDate (date : Date) : string
    {
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
    }
    
    public static formatAddress (address : string) : string
    {
        if (!address) {
            return '';
        }
        return address.substr(0, 8) + '...' + address.substr(-8);
    }
    
    public static formatPublicKey (address : string) : string
    {
        if (!address) {
            return '';
        }
        return address.substr(0, 8) + '...' + address.substr(-6);
    }
    
}
