import { StakePool } from '#/App/Domain/Model/StakePool';
import { Pagination } from '@inti5/api-frontend/Domain';
import * as Api from '@inti5/api-frontend';


export class StakePoolService
    extends Api.ApiConsumer<StakePool>
{
    
    public static readonly RESOURCE = StakePool;
    
    public static getDefaultPagination () : Pagination
    {
        return new Pagination([ 25, 50, 100 ], 25);
    }
    
}
