import { ObservationType } from '#/Watchdog/Domain/Type/ObservationType';
import { API } from '@inti5/api-frontend';
import * as Trans from 'class-transformer';


@API.Resource('Watchdog/Observation/Notifications')
export class ObservationNotifications
{
    
    @API.Property()
    public readonly [ObservationType.ClaimableRewards] : number;
    
    @API.Property()
    public readonly [ObservationType.RewardsDrop] : number;
    
    @API.Property()
    public readonly [ObservationType.PoolCommissionChange] : number;
    
    
    @API.Property()
    public readonly [ObservationType.UnresponsiveWorker] : number;
    
    @API.Property()
    public readonly [ObservationType.StuckedNode] : number;
    
    @API.Property()
    public readonly [ObservationType.FreePoolFunds] : number;
    
    @API.Property()
    public readonly [ObservationType.PendingWithdrawals] : number;
    
    
    public constructor (data? : Partial<ObservationNotifications>)
    {
        Trans.plainToClassFromExist(this, data);
    }
    
}
