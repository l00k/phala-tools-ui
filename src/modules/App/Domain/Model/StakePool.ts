import { Account } from '#/App/Domain/Model/Account';
import { Annotation as API } from '@inti5/api-frontend';
import { StorageModel } from '@inti5/app-frontend/Store';


@StorageModel('PhalaStats/StakePool')
@API.Resource()
export class StakePools
{
    
    @API.Property()
    public id : number;
    
    @API.Property()
    public onChainId : number;
    
    @API.Property()
    public owner : Account;
    
}
