import { Observation } from '#/Watchdog/Domain/Model/Observation';
import * as Api from '@inti5/api-frontend';


export class ObservationService
    extends Api.EntityService<Observation>
{
    
    public static readonly ENTITY = Observation;
    
    public static getDefaultPagination () : Api.Domain.Pagination
    {
        return new Api.Domain.Pagination([ 25, 50, 100 ], 25);
    }
    
}
