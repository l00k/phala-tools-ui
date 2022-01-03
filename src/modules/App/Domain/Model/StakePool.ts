import Account from '#/App/Domain/Model/Account';
import * as API from '@inti5/api';
import { StorageModel } from '@inti5/app-frontend/Store';


@StorageModel('PhalaStats/StakePool')
@API.Resource()
export default class StakePools
{
    
    @API.Property()
    public id : number;
    
    @API.Property()
    public onChainId : number;
    
    @API.Property()
    public owner : Account;
    
}
