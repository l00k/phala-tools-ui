import { Event } from '#/App/Domain/Model/Event';
import * as Api from '@inti5/api-frontend';
import { CollectionRequest, Filters, Pagination } from '@inti5/api-frontend/Domain';


export class EventService
    extends Api.ApiConsumer<Event<any>>
{
    
    public static readonly RESOURCE = Event;
    
    public static getDefaultPagination () : Pagination
    {
        return new Pagination([ 200 ]);
    }
    
    public getStakePoolEventsFetcher (
        stakePoolId : number,
        filters? : Filters<Event<any>>
    ) : AsyncGenerator<Event<any>[], void, void>
    {
        const request = new CollectionRequest<Event<any>>({ filters });
        
        const path = `stake_pool/${stakePoolId}/events`;
        return super.getFetcher(
            request,
            path
        );
    }
    
}
