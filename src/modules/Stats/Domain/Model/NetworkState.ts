import { Annotation as API } from '@inti5/api-frontend';
import * as Trans from 'class-transformer';


@API.Resource('Stats/NetworkState')
@API.Cacheable({ lifetime: 15 * 60 * 1000 })
export class NetworkState
{
    
    @API.Id()
    public id : number;
    
    @API.Property()
    public entryNonce : number;
    
    @API.Property()
    public entryDate : Date;
    
    @API.Property()
    public totalShares : number = 0;
    
    
    public constructor (data? : Partial<NetworkState>)
    {
        Trans.plainToClassFromExist(this, data);
    }
    
}
