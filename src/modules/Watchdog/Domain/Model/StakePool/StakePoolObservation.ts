import { Account } from '#/Watchdog/Domain/Model/Account';
import { StakePool } from '#/Watchdog/Domain/Model/StakePool';
import { ObservationConfiguration } from '#/Watchdog/Domain/Model/StakePool/Observation/ObservationConfiguration';
import { ObservationNotifications } from '#/Watchdog/Domain/Model/StakePool/Observation/ObservationNotifications';
import { Annotation as API } from '@inti5/api-frontend';


export enum ObservationMode
{
    Owner = 'owner',
    Delegator = 'delegator',
}


@API.Resource('Watchdog/StakePool/Observation')
export class StakePoolObservation
{
    
    @API.Id()
    public id : number;
    
    @API.Property(() => StakePool)
    public stakePool : StakePool;
    
    @API.Property(() => Account)
    public account : Account;
    
    @API.Property()
    public mode : ObservationMode;
    
    
    @API.Property(() => ObservationConfiguration)
    public config : ObservationConfiguration = new ObservationConfiguration();
    
    
    @API.Property(() => ObservationNotifications)
    public lastNotifications : ObservationNotifications = new ObservationNotifications();
    
}
