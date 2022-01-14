import { Annotation as API } from '@inti5/api-frontend';


@API.Resource()
export class Tag
{
    
    @API.Id()
    public id : number;
    
    @API.Property()
    public name : string = '';
    
    @API.Property()
    public color : string = '';
    
}
