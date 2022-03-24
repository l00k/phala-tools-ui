import { Annotation as API } from '@inti5/api-frontend';


@API.Resource('Watchdog/Account')
export class Account
{
    
    @API.Id()
    public id : number;
    
    
    @API.Property()
    public address : string;
    
}
