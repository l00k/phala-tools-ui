import { StakePool } from '#/App/Domain/Model/StakePool';
import { Pagination } from '@/core/inti5/api-frontend/Domain';
import * as Api from '@inti5/api-frontend';


export class StakePoolService
    extends Api.ApiConsumer<StakePool>
{
    
    protected static readonly RESOURCE = StakePool;
    protected static readonly DEFAULT_PAGINATION : Pagination = new Pagination([ 25, 50, 100 ], 25);
    
}
