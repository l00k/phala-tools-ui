import { Account } from '#/Watchdog/Domain/Model/Account';
import { StakePool } from '#/Watchdog/Domain/Model/StakePool';
import { StakePoolObservationConfiguration } from '#/Watchdog/Domain/Model/StakePoolObservationConfiguration';
import { Annotation as API } from '@inti5/api-frontend';


export enum NotificationType
{
    ClaimableRewards = 'claimableRewards',
    RewardsDrop = 'rewardsDrop',
}

export enum ObservationMode
{
    Owner = 'owner',
    Delegator = 'delegator',
}


type LastNotifications = {
    [notificationType : string] : number
};


@API.Resource('Watchdog/StakePoolObservation')
export class StakePoolObservation
{
    
    @API.Id()
    @API.Groups([
        'Watchdog/User',
    ])
    public id : number;
    
    
    @API.Property(() => StakePool)
    public stakePool : StakePool;
    
    @API.Property(() => Account)
    public account : Account;
    
    @API.Property()
    public mode : ObservationMode;
    
    
    @API.Property(() => StakePoolObservationConfiguration)
    public config : StakePoolObservationConfiguration = new StakePoolObservationConfiguration();
    
    
    @API.Property()
    public lastNotifications : LastNotifications = {};
    
    
    public getLastNotification (notificationType : NotificationType) : number
    {
        return this.lastNotifications[notificationType];
    }
    
    public updateLastNotification (notificationType : NotificationType)
    {
        this.lastNotifications[notificationType] = Date.now();
    }
    
}
