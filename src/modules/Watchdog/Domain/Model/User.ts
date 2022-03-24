import { Annotation as API } from '@inti5/api-frontend';


@API.Resource()
export class User
{
    
    @API.Id()
    public id : number;
    
    @API.Property()
    public msgChannel : string;
    
    @API.Property()
    public username : string;
    
}
