import { Account } from '#/Stats/Domain/Model/Account';


export function getSubscanAccountUrl (account : Account) : string
{
    return `https://khala.subscan.io/account/${account?.address}`;
}
