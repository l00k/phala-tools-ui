import { Annotation as API } from '@inti5/api-frontend';
import * as Trans from 'class-transformer';


export enum NotificationType
{
    ClaimableRewards = 'claimableRewards',
    RewardsDrop = 'rewardsDrop',
    PoolCommissionChange = 'poolCommissionChange',
    
    UnresponsiveWorker = 'unresponsiveWorker',
    NodeStuck = 'nodeStuck',
    FreePoolFunds = 'freePoolFunds',
    PendingWithdrawals = 'pendingWithdrawals',
}


@API.Resource('Watchdog/StakePool/Observation/Notifications')
export class ObservationNotifications
{
    
    @API.Property()
    [NotificationType.ClaimableRewards] : number;
    
    @API.Property()
    [NotificationType.RewardsDrop] : number;
    
    @API.Property()
    [NotificationType.PoolCommissionChange] : number;
    
    
    @API.Property()
    [NotificationType.UnresponsiveWorker] : number;
    
    @API.Property()
    [NotificationType.NodeStuck] : number;
    
    @API.Property()
    [NotificationType.FreePoolFunds] : number;
    
    @API.Property()
    [NotificationType.PendingWithdrawals] : number;
    
    
    public constructor (data? : Partial<ObservationNotifications>)
    {
        Trans.plainToClassFromExist(this, data);
    }
    
}
