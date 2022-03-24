import { HistoryEntry } from '#/Stats/Domain/Model/StakePool/HistoryEntry';
import * as Api from '@/core/api-frontend';


export class HistoryEntryService
    extends Api.EntityService<HistoryEntry>
{
    
    public static readonly RESOURCE = HistoryEntry;
    
    public static getDefaultPagination () : Api.Domain.Pagination
    {
        return new Api.Domain.Pagination([ 200 ]);
    }
    
    public getStakePoolHistoryFetcher (
        stakePoolId : number
    ) : AsyncGenerator<HistoryEntry[], void, void>
    {
        const path = `stake_pool/${stakePoolId}/history`;
        return super.getFetcher(
            null,
            path
        );
    }
    
}
