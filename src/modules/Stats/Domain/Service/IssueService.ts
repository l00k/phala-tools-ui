import { Issue } from '#/Stats/Domain/Model/Issue';
import * as Api from '@/core/api-frontend';


export class IssueService
    extends Api.EntityService<Issue>
{
    
    public static readonly RESOURCE = Issue;
    
    public static getDefaultPagination () : Api.Domain.Pagination
    {
        return new Api.Domain.Pagination([ 1000 ], 1000);
    }
    
}
