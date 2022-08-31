import { StakePool } from '#/Phala/Domain/Model/StakePool';
import { HistoryEntry } from '#/Stats/Domain/Model/HistoryEntry';
import { Issue } from '#/Stats/Domain/Model/Issue';
import { API } from '@inti5/api-frontend';
import { Type } from '@inti5/graph-typing';
import * as Trans from 'class-transformer';


@API.Resource('Stats/StakePoolEntry')
export class StakePoolEntry
{
    
    public static readonly SPECIAL_NETWORK_AVG_ID = 1;
    public static readonly SPECIAL_TOP_AVG_ID = 2;
    
    
    @API.Id()
    public id : number;
    
    @API.Property()
    @Type(() => StakePool)
    public stakePool : StakePool;
    
    @API.Property()
    public special : string;
    
    @API.Property()
    @Type(() => HistoryEntry)
    public lastHistoryEntry : HistoryEntry;
    
    @API.Property()
    @Type(() => [ Issue ])
    public issues : Issue[];
    
    
    public constructor (data? : Partial<StakePoolEntry>)
    {
        Trans.plainToClassFromExist(this, data);
    }
    
}
