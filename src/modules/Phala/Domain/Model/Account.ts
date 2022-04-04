import { Annotation as API } from '@inti5/api-frontend';
import * as Trans from 'class-transformer';


@API.Resource('Account')
@API.Cacheable({ lifetime: 15 * 60 * 1000 })
export class Account
{
    
    
    @API.Id()
    public id : number;
    
    
    @API.Property()
    public address : string;
    
    @API.Property()
    public identity : string;
    
    @API.Property()
    public identityVerified : boolean = false;
    
    
    public constructor (data? : Partial<Account>)
    {
        if (data) {
            Trans.plainToClassFromExist(this, data);
        }
    }
    
}
