import { Account } from '#/Phala/Domain/Model/Account';
import * as Api from '@inti5/api-frontend';
import { ApiException } from '@inti5/api-frontend/Exception';
import cloneDeep from 'lodash/cloneDeep';


export class AccountService
    extends Api.EntityService<Account>
{
    
    public static readonly ENTITY = Account;
    
    public static getDefaultPagination () : Api.Domain.Pagination
    {
        return new Api.Domain.Pagination([ 25, 50, 100 ], 25);
    }
    
    
    public async findAccount (address : string) : Promise<Account>
    {
        const path = this.resource.path + `/find/${address}`;
        return this.getItem(null, path);
    }
    
}
