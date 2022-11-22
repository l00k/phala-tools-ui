import { Snapshot } from '#/Stats/Domain/Model/Snapshot';
import { API } from '@inti5/api-frontend';
import { Type } from '@inti5/graph-typing';
import * as Trans from 'class-transformer';


@API.Resource('Stats/NetworkState')
export class NetworkState
{
    
    @API.Id()
    public id : number;
    
    @API.Property()
    @Type(() => Snapshot)
    public snapshot : Snapshot;
    
    @API.Property()
    public totalShares : number = 0;
    
    @API.Property()
    public phaPrice : number = 0;
    
    
    public constructor (data? : Partial<NetworkState>)
    {
        Trans.plainToClassFromExist(this, data);
    }
    
}
