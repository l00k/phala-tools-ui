import { StakePool } from '#/Phala/Domain/Model/StakePool';
import { HistoryEntry } from '#/Stats/Domain/Model/HistoryEntry';
import { Issue } from '#/Stats/Domain/Model/Issue';
import { Annotation as API } from '@inti5/api-frontend';
import * as Trans from 'class-transformer';


@API.Resource('Stats/StakePoolEntry')
@API.Cacheable({ lifetime: 15 * 60 * 1000 })
export class StakePoolEntry
{
    
    public static readonly SPECIAL_NETWORK_AVG_ID = 1;
    public static readonly SPECIAL_TOP_AVG_ID = 2;
    
    
    @API.Id()
    public id : number;
    
    @API.Property(() => StakePool)
    public stakePool : StakePool;
    
    @API.Property()
    public special : string;
    
    @API.Property(() => HistoryEntry)
    public lastHistoryEntry : HistoryEntry;
    
    @API.Property(() => [ Issue ])
    public issues : Issue[];
    
    
    public constructor (data? : Partial<StakePoolEntry>)
    {
        Trans.plainToClassFromExist(this, data);
    }
    
}
