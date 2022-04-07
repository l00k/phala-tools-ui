import { StakePoolEntry } from '#/Stats/Domain/Model/StakePoolEntry';
import * as Api from '@inti5/api-frontend';


export class StakePoolEntryService
    extends Api.EntityService<StakePoolEntry>
{
    
    public static readonly ENTITY = StakePoolEntry;
    
    public static getDefaultPagination () : Api.Domain.Pagination
    {
        return new Api.Domain.Pagination([ 25, 50, 100 ], 25);
    }
    
}
