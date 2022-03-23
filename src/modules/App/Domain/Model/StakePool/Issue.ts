import { Annotation as API } from '@inti5/api-frontend';


@API.Resource()
@API.Cacheable()
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
    
}
