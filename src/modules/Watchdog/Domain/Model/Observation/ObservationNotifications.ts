import { Assert } from '@inti5/validator/Object';
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


@API.Resource('Watchdog/Observation/Notifications')
export class ObservationNotifications
{
    
    @API.Property()
    public readonly [NotificationType.ClaimableRewards] : number;
    
    @API.Property()
    public readonly [NotificationType.RewardsDrop] : number;
    
    @API.Property()
    public readonly [NotificationType.PoolCommissionChange] : number;
    
    
    @API.Property()
    public readonly [NotificationType.UnresponsiveWorker] : number;
    
    @API.Property()
    public readonly [NotificationType.NodeStuck] : number;
    
    @API.Property()
    public readonly [NotificationType.FreePoolFunds] : number;
    
    @API.Property()
    public readonly [NotificationType.PendingWithdrawals] : number;
    
    
    public constructor (data? : Partial<ObservationNotifications>)
    {
        Trans.plainToClassFromExist(this, data);
    }
    
}
