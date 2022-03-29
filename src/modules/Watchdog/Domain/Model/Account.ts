import { Annotation as API } from '@inti5/api-frontend';
import * as Trans from 'class-transformer';


@API.Resource('Watchdog/Account')
export class Account
{
    
    @API.Id()
    public id : number;
    
    
    @API.Property()
    public address : string;
    
    @API.Property()
    public identity : string;
    
    
    public constructor (data? : Partial<Account>)
    {
        Trans.plainToClassFromExist(this, data);
    }
    
}
