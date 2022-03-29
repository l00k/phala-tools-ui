import { Account } from '#/Watchdog/Domain/Model/Account';
import * as Api from '@/core/api-frontend';
import { ApiException } from '@/core/api-frontend/Exception';
import cloneDeep from 'lodash/cloneDeep';


export class AccountService
    extends Api.EntityService<Account>
{
    
    public static readonly RESOURCE = Account;
    
    public static getDefaultPagination () : Api.Domain.Pagination
    {
        return new Api.Domain.Pagination([ 25, 50, 100 ], 25);
    }
    
    
    public async findAccount (
        address : string
    ) : Promise<Account>
    {
        const Service : typeof Api.EntityService = <any>this.constructor;
        
        const path = this.resource.path + `/find/${address}`;
        
        const response = await this._apiClient.get(path);
        if (response.status !== 200) {
            throw new ApiException(`Didn't get proper response`, 1648437483618);
        }
        
        return await this._api.deserialize<Account>(
            cloneDeep(response.data),
            { endpoint: this.resource.name },
            { transformOptions: { ignoreDecorators: true } }
        );
    }
    
}
