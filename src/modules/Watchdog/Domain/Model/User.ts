import { Account } from '#/Watchdog/Domain/Model/Account';
import { MessagingChannel } from '#/Watchdog/Domain/Model/MessagingChannel';
import { StakePoolObservation } from '#/Watchdog/Domain/Model/StakePoolObservation';
import { UserConfiguration } from '#/Watchdog/Domain/Model/UserConfiguration';
import { Annotation as API } from '@inti5/api-frontend';


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
    public createdAt : Date = new Date();
    
    @API.Property()
    public updatedAt : Date = new Date();
    
    
    @API.Property(() => UserConfiguration)
    public config : UserConfiguration = new UserConfiguration();
    
    @API.Property(() => Account)
    public accounts : Account[];
    
    @API.Property(() => StakePoolObservation)
    public stakePoolObservations : StakePoolObservation[];
    
}
