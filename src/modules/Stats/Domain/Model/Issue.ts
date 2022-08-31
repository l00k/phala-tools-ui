import { API } from '@inti5/api-frontend';
import * as Trans from 'class-transformer';


@API.Resource('Stats/Issue')
@API.Cacheable({ lifetime: 15 * 60 * 1000 })
export class Issue
{
    
    @API.Id()
    public id : number = null;
    
    @API.Property()
    public name : string = '';
    
    @API.Property()
    public description : string = '';
    
    @API.Property()
    public color : string = '';
    
    
    public constructor (data? : Partial<Issue>)
    {
        Trans.plainToClassFromExist(this, data);
    }
    
}
