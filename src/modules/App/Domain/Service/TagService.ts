import { Tag } from '#/App/Domain/Model/Tag';
import { Pagination } from '@inti5/api-frontend/Domain';
import * as Api from '@inti5/api-frontend';


export class TagService
    extends Api.ApiConsumer<Tag>
{
    
    public static readonly RESOURCE = Tag;
    
    public static getDefaultPagination () : Pagination
    {
        return new Pagination([ 1000 ], 1000);
    }
    
}
