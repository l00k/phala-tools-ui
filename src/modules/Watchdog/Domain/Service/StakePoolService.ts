import * as Api from '@/core/api-frontend';
import { StakePool } from '#/Watchdog/Domain/Model/StakePool';


export class StakePoolService
    extends Api.EntityService<StakePool>
{
    
    public static readonly RESOURCE = StakePool;
    
    public static getDefaultPagination () : Api.Domain.Pagination
    {
        return new Api.Domain.Pagination([ 25, 50, 100 ], 25);
    }
    
}
