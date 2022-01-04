import { Annotation as API } from '@inti5/api-frontend';
import { StorageModel } from '@inti5/app-frontend/Store';


@StorageModel('PhalaStats/Tag')
@API.Resource()
export class Tag
{
    
    @API.Property()
    public id : number;
    
    @API.Property()
    public name : string = '';
    
    @API.Property()
    public color : string = '';
    
}
