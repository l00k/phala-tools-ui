import { Event } from '#/App/Domain/Model/Event';
import * as Api from '@/core/api-frontend';


export class EventService
    extends Api.EntityService<Event<any>>
{
    
    public static readonly RESOURCE = Event;
    
    public static getDefaultPagination () : Api.Domain.Pagination
    {
        return new Api.Domain.Pagination([ 200 ]);
    }
    
    public getStakePoolEventsFetcher (
        stakePoolId : number,
        filters? : Api.Domain.Filters<Event<any>>
    ) : AsyncGenerator<Event<any>[], void, void>
    {
        const request = new Api.Domain.CollectionRequest<Event<any>>({ filters });
        
        const path = `stake_pool/${stakePoolId}/events`;
        return super.getFetcher(
            request,
            path
        );
    }
    
}
