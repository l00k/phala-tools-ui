import { Assert } from '@/core/validator/Object';
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
    @Assert({
        numericality: {
            onlyInteger: true,
            greaterThan: 0,
        }
    })
    [NotificationType.ClaimableRewards] : number;
    
    @API.Property()
    @Assert({
        numericality: {
            onlyInteger: true,
            greaterThan: 0,
        }
    })
    [NotificationType.RewardsDrop] : number;
    
    @API.Property()
    @Assert({
        numericality: {
            onlyInteger: true,
            greaterThan: 0,
        }
    })
    [NotificationType.PoolCommissionChange] : number;
    
    
    @API.Property()
    @Assert({
        numericality: {
            onlyInteger: true,
            greaterThan: 0,
        }
    })
    [NotificationType.UnresponsiveWorker] : number;
    
    @API.Property()
    @Assert({
        numericality: {
            onlyInteger: true,
            greaterThan: 0,
        }
    })
    [NotificationType.NodeStuck] : number;
    
    @API.Property()
    @Assert({
        numericality: {
            onlyInteger: true,
            greaterThan: 0,
        }
    })
    [NotificationType.FreePoolFunds] : number;
    
    @API.Property()
    @Assert({
        numericality: {
            onlyInteger: true,
            greaterThan: 0,
        }
    })
    [NotificationType.PendingWithdrawals] : number;
    
    
    public constructor (data? : Partial<ObservationNotifications>)
    {
        Trans.plainToClassFromExist(this, data);
    }
    
}
