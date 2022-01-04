import { Tag } from '#/App/Domain/Model/Tag';
import { Pagination } from '@/core/inti5/api-frontend/Domain';
import * as Api from '@inti5/api-frontend';


export class TagService
    extends Api.ApiConsumer<Tag>
{
    
    protected static readonly RESOURCE = Tag;
    protected static readonly DEFAULT_PAGINATION : Pagination = new Pagination([ 25, 50, 100 ], 25);

}
