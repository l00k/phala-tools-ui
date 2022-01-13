import { Account } from '#/App/Domain/Model/Account';
import numbro from 'numbro';


export function getSubscanAccountUrl (account : Account) : string
{
    return `https://khala.subscan.io/account/${account?.address}`;
}

export function formatNumber (amount : number) : string
{
    return numbro(amount).format('0.000 a');
}

export function formatPercent (percent : number) : string
{
    return numbro(percent).format('0.0%');
}

export function formatCoin (value : number, format : string | numbro.Format = {})
{
    if (format instanceof Object) {
        format = {
            thousandSeparated: true,
            mantissa: 2,
            ...format
        };
    }
    
    return numbro(value).format(format);
}

export function unformatCoin (amountRaw : any, format : string | numbro.Format = {}) : number
{
    if (format instanceof Object) {
        format = {
            thousandSeparated: true,
            mantissa: 2,
            ...format
        };
    }
    
    return numbro.unformat(amountRaw, format);
}

export function formatAddress (address : string) : string
{
    if (!address) {
        return '';
    }
    return address.substr(0, 8) + '...' + address.substr(-8);
}

export function formatPublicKey (publicKey : string) : string
{
    if (!publicKey) {
        return '';
    }
    return publicKey.substr(0, 10) + '...' + publicKey.substr(-8);
}
