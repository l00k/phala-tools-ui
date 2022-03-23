import { Tag } from '#/App/Domain/Model/Tag';
import { Annotation as API } from '@inti5/api-frontend';


@API.Resource()
export class Account
{
    
    @API.Id()
    public id : number;
    
    @API.Property()
    public address : string;
    
    @API.Property()
    public alias : string;
    
    @API.Property()
    public identity : string;
    
    @API.Property()
    public identityVerified : boolean;
    
    @API.Property(() => Tag)
    public tags : Tag[] = [];
    
    
    public get friendlyName () : string
    {
        return this.alias ?? this.identity;
    }
    
}
