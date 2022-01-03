import * as API from '@/core/inti5/api';
import { StorageModel } from '@inti5/app-frontend/Store';


@StorageModel('PhalaStats/Tag')
@API.Resource()
export default class Tag
{
    
    @API.Property()
    public id : number;
    
    @API.Property()
    public name : string = '';
    
    @API.Property()
    public color : string = '';
    
}
