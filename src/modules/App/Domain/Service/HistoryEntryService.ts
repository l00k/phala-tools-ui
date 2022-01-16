import { HistoryEntry } from '#/App/Domain/Model/StakePool/HistoryEntry';
import { CollectionRequest, Pagination } from '@/core/inti5/api-frontend/Domain';
import * as Api from '@inti5/api-frontend';
import { Collection } from '@inti5/api-frontend';


export class HistoryEntryService
    extends Api.ApiConsumer<HistoryEntry>
{
    
    public static readonly RESOURCE = HistoryEntry;
    
    public static getDefaultPagination () : Pagination
    {
        return new Pagination([ 360 ]);
    }
    
    public async getStakePoolHistoryCollection (
        stakePoolId : number,
        pagination? : Partial<Pagination>
    ) : Promise<Collection<HistoryEntry>>
    {
        const collectionRequest = new CollectionRequest<HistoryEntry>({ pagination });
        
        const path = `stake_pool/${stakePoolId}/history`;
        return super.getCollection(
            collectionRequest,
            path
        );
    }
    
}
