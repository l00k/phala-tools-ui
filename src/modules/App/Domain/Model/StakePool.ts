import { Account } from '#/App/Domain/Model/Account';
import { HistoryEntry } from '#/App/Domain/Model/StakePool/HistoryEntry';
import { Issue } from '#/App/Domain/Model/StakePool/Issue';
import { Annotation as API } from '@inti5/api-frontend';


@API.Resource()
export class StakePool
{

    public static readonly SPECIAL_NETWORK_AVG_ID = 1;
    public static readonly SPECIAL_TOP_AVG_ID = 2;
    
    
    @API.Id()
    public id : number;
    
    @API.Property()
    public onChainId : number;
    
    @API.Property()
    public special : string;
    
    @API.Property(() => Account)
    public owner : Account;
    
    @API.Property(() => HistoryEntry)
    public lastHistoryEntry : HistoryEntry;
    
    @API.Property(() => Issue)
    public issues : Issue[];
    
}
