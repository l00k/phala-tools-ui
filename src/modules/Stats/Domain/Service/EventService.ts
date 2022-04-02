import { Event } from '#/Stats/Domain/Model/Event';
import * as Api from '@/core/api-frontend';


export class EventService
    extends Api.EntityService<Event>
{
    
    public static readonly RESOURCE = Event;
    
    public static getDefaultPagination () : Api.Domain.Pagination
    {
        return new Api.Domain.Pagination([ 200 ]);
    }
    
    public getStakePoolEventsFetcher (
        stakePoolId : number,
        filters? : Api.Domain.Filters<Event>
    ) : AsyncGenerator<Event[], void, void>
    {
        const request = new Api.Domain.CollectionRequest<Event>({ filters });
        
        const path = `#PATH#/by_stakepool/${stakePoolId}`;
        return super.getFetcher(
            request,
            path
        );
    }
    
}
