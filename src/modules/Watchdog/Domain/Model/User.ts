import { MessagingChannel } from '#/Watchdog/Domain/Model/MessagingChannel';
import { Observation } from '#/Watchdog/Domain/Model/Observation';
import { UserConfiguration } from '#/Watchdog/Domain/Model/UserConfiguration';
import { API } from '@inti5/api-frontend';
import { Type } from '@inti5/graph-typing';
import * as Trans from 'class-transformer';


@API.Resource('Watchdog/User')
export class User
{
    
    @API.Id()
    public id : number;
    
    
    @API.Property()
    public msgChannel : MessagingChannel;
    
    @API.Property()
    public username : string;
    
    @API.Property()
    @Type(() => UserConfiguration)
    public config : UserConfiguration = new UserConfiguration();
    
    @API.Property()
    @Type(() => [ Observation ])
    public observations : Observation[];
    
    
    public constructor (data? : Partial<User>)
    {
        Trans.plainToClassFromExist(this, data);
    }
    
}
