import { HistoryEntry } from '#/App/Domain/Model/StakePool/HistoryEntry';
import { CollectionRequest, Pagination } from '@inti5/api-frontend/Domain';
import * as Api from '@inti5/api-frontend';
import { Collection } from '@inti5/api-frontend';


export class HistoryEntryService
    extends Api.ApiConsumer<HistoryEntry>
{
    
    public static readonly RESOURCE = HistoryEntry;
    
    public static getDefaultPagination () : Pagination
    {
        return new Pagination([ 200 ]);
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
