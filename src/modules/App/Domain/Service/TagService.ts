import Tag from '#/App/Domain/Model/Tag';
import { Inject } from '@inti5/object-manager';
import * as Api from '@inti5/api-frontend';


export default class TagService
    extends Api.Con
{

    public async find() : Promise<Tag[]>
    {
        return [];
    }

}
