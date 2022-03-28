import { Annotation as API } from '@inti5/api-frontend';


export enum NotificationType
{
    ClaimableRewards = 'claimableRewards',
    RewardsDrop = 'rewardsDrop',
}


@API.Resource('Watchdog/StakePool/Observation/Notifications')
export class ObservationNotifications
{
    
    @API.Property()
    [NotificationType.ClaimableRewards] : number;
    
    @API.Property()
    [NotificationType.RewardsDrop] : number;
    
}
