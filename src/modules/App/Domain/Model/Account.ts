import Tag from '#/App/Domain/Model/Tag';
import { Annotation as API } from '@inti5/api-frontend';
import { StorageModel } from '@inti5/app-frontend/Store';


@StorageModel('PhalaStats/Account')
@API.Resource()
export class Account
{
    
    @API.Property()
    public id : number;
    
    @API.Property()
    public address : string;
    
    @API.Property()
    public identity : string = '';
    
    @API.Property()
    public alias : string = '';
    
    @API.Property(() => Tag)
    public tags : Tag[] = [];
    
    
    public get displayName () : string
    {
        if (this.alias) {
            return this.alias + (this.identity ? ` (${this.identity})` : '');
        }
        else if (this.identity) {
            return this.identity;
        }
        else {
            return this.address;
        }
    }
    
}
