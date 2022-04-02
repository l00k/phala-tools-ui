import * as Phala from '#/Phala/Domain/Model';
import { Account } from '#/Phala/Domain/Model';
import { HistoryEntry } from '#/Stats/Domain/Model/HistoryEntry';
import { Issue } from '#/Stats/Domain/Model/Issue';
import { Annotation as API } from '@inti5/api-frontend';
import * as Trans from 'class-transformer';


@API.Resource('Stats/StakePoolEntry')
export class StakePoolEntry
{
    
    public static readonly SPECIAL_NETWORK_AVG_ID = 1;
    public static readonly SPECIAL_TOP_AVG_ID = 2;
    
    
    @API.Id()
    public id : number;
    
    @API.Property()
    public stakePool : Phala.StakePool;
    
    @API.Property()
    public special : string;
    
    @API.Property(() => HistoryEntry)
    public lastHistoryEntry : HistoryEntry;
    
    @API.Property(() => Issue)
    public issues : Issue[];
    
    
    public constructor (data? : Partial<StakePoolEntry>)
    {
        Trans.plainToClassFromExist(this, data);
    }
    
}