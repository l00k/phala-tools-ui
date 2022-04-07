import { NetworkState } from '#/Stats/Domain/Model/NetworkState';
import * as Api from '@inti5/api-frontend';


export class NetworkStateService
    extends Api.EntityService<NetworkState>
{
    
    public static readonly ENTITY = NetworkState;
    
    public static getDefaultPagination () : Api.Domain.Pagination
    {
        return new Api.Domain.Pagination([ 1000 ], 1000);
    }
    
    
    public async getLatestNetworkState () : Promise<NetworkState>
    {
        return this.getItem(null, '#PATH#/latest');
    }
    
}
