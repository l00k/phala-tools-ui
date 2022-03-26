import { StakePool } from '#/Stats/Domain/Model/StakePool';
import * as Api from '@/core/api-frontend';


export class StakePoolService
    extends Api.EntityService<StakePool>
{
    
    public static readonly RESOURCE = StakePool;
    
    public static getDefaultPagination () : Api.Domain.Pagination
    {
        return new Api.Domain.Pagination([ 25, 50, 100 ], 25);
    }
    
}