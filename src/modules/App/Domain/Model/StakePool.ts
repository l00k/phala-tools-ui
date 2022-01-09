import { Account } from '#/App/Domain/Model/Account';
import { HistoryEntry } from '#/App/Domain/Model/StakePool/HistoryEntry';
import { Annotation as API } from '@inti5/api-frontend';


@API.Resource()
export class StakePool
{
    
    @API.Property()
    public id : number;
    
    @API.Property()
    public onChainId : number;
    
    @API.Property(() => Account)
    public owner : Account;
    
    @API.Property(() => HistoryEntry)
    public lastHistoryEntry : HistoryEntry;
    
}
