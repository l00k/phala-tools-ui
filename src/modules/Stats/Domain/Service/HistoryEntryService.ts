import { HistoryEntry } from '#/Stats/Domain/Model/HistoryEntry';
import * as Api from '@inti5/api-frontend';


export class HistoryEntryService
    extends Api.EntityService<HistoryEntry>
{
    
    public static readonly ENTITY = HistoryEntry;
    
    public static getDefaultPagination () : Api.Domain.Pagination
    {
        return new Api.Domain.Pagination([ 200 ]);
    }
    
    public getStakePoolHistoryFetcher (
        stakePoolId : number
    ) : AsyncGenerator<HistoryEntry[], void, void>
    {
        const path = `#PATH#/by_stakepool/${stakePoolId}`;
        return super.getFetcher(
            null,
            path
        );
    }
    
}
