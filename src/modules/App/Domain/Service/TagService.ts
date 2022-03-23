import { Tag } from '#/App/Domain/Model/Tag';
import * as Api from '@/core/api-frontend';


export class TagService
    extends Api.EntityService<Tag>
{
    
    public static readonly RESOURCE = Tag;
    
    public static getDefaultPagination () : Api.Domain.Pagination
    {
        return new Api.Domain.Pagination([ 1000 ], 1000);
    }
    
}
