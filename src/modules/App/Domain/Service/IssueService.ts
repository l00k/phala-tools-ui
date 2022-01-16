import { Issue } from '#/App/Domain/Model/StakePool/Issue';
import { Pagination } from '@inti5/api-frontend/Domain';
import * as Api from '@inti5/api-frontend';


export class IssueService
    extends Api.ApiConsumer<Issue>
{
    
    public static readonly RESOURCE = Issue;
    
    public static getDefaultPagination () : Pagination
    {
        return new Pagination([ 1000 ], 1000);
    }
    
}
