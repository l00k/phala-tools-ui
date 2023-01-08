import { API } from '@inti5/api-frontend';
import * as Trans from 'class-transformer';


@API.Resource('Stats/Snapshot')
export class Snapshot
{
    
    @API.Id()
    public id : number;
    
    @API.Property()
    public date : Date;
    
    
    public constructor (data? : Partial<Snapshot>)
    {
        Trans.plainToClassFromExist(this, data);
    }
    
}
