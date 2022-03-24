import { Account } from '#/Watchdog/Domain/Model/Account';
import { Annotation as API } from '@inti5/api-frontend';



@API.Resource('Watchdog/StakePool')
export class StakePool
{
    
    @API.Id()
    public id : number;
    
    
    @API.Property()
    public onChainId : number;
    
    @API.Property(() => Account)
    public owner : Account;
    
}
