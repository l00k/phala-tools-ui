import { NotificationType } from '#/Watchdog/Domain/Model/StakePool/Observation/ObservationNotifications';
import { Annotation as API } from '@inti5/api-frontend';
import * as Trans from 'class-transformer';


@API.Resource('Watchdog/StakePool/Observation/NotificationConfig')
export class NotificationConfig
{
    
    @API.Property()
    public active : boolean;
    
    @API.Property()
    public frequency : number;
    
    @API.Property()
    public threshold : number;
    
    
    public constructor (data? : Partial<NotificationConfig>)
    {
        Trans.plainToClassFromExist(this, data);
    }
    
}


@API.Resource('Watchdog/StakePool/Observation/Configuration')
export class ObservationConfiguration
{
    
    @API.Property(() => NotificationConfig)
    [NotificationType.ClaimableRewards] : NotificationConfig = new NotificationConfig({
        active: true,
        frequency: 604800,
        threshold: 100,
    });
    
    @API.Property(() => NotificationConfig)
    [NotificationType.RewardsDrop] : NotificationConfig = new NotificationConfig({
        active: true,
        frequency: 86400,
        threshold: 25,
    });
    
    @API.Property(() => NotificationConfig)
    [NotificationType.PoolCommissionChange] : NotificationConfig = new NotificationConfig({
        active: true,
        frequency: 86400,
        threshold: 10,
    });
    
    
    @API.Property(() => NotificationConfig)
    [NotificationType.UnresponsiveWorker] : NotificationConfig = new NotificationConfig({
        active: true,
        frequency: 3600,
    });
    
    @API.Property(() => NotificationConfig)
    [NotificationType.NodeStuck] : NotificationConfig = new NotificationConfig({
        active: true,
        frequency: 3600,
    });
    
    @API.Property(() => NotificationConfig)
    [NotificationType.FreePoolFunds] : NotificationConfig = new NotificationConfig({
        active: true,
        frequency: 86400,
        threshold: 10000,
    });
    
    @API.Property(() => NotificationConfig)
    [NotificationType.PendingWithdrawals] : NotificationConfig = new NotificationConfig({
        active: true,
        frequency: 86400,
        threshold: 0,
    });
    
    
    public constructor (data? : Partial<ObservationConfiguration>)
    {
        Trans.plainToClassFromExist(this, data);
    }
    
};
