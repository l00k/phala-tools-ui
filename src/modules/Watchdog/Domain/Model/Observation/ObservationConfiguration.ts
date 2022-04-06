import { NotificationType } from '#/Watchdog/Domain/Model/Observation/ObservationNotifications';
import { Assert, AssertObject } from '@/core/validator/Object';
import { Annotation as API } from '@inti5/api-frontend';
import * as Trans from 'class-transformer';


@API.Resource('Watchdog/Observation/NotificationConfig')
export class NotificationConfig
{
    
    @API.Property()
    @Assert({
        presence: true,
        type: 'boolean',
    })
    public active : boolean;
    
    @API.Property()
    @Assert({
        numericality: {
            onlyInteger: true,
            greaterThanOrEqualTo: 0,
        }
    })
    public frequency : number;
    
    @API.Property()
    @Assert({
        numericality: {
            onlyInteger: true,
            greaterThanOrEqualTo: 0,
        }
    })
    public threshold : number;
    
    
    public constructor (data? : Partial<NotificationConfig>)
    {
        Trans.plainToClassFromExist(this, data);
    }
    
}


@API.Resource('Watchdog/Observation/Configuration')
export class ObservationConfiguration
{
    
    @API.Property(() => NotificationConfig)
    @Assert({ presence: true })
    @AssertObject({
        threshold: {
            numericality: {
                greaterThan: 0,
            }
        }
    })
    public [NotificationType.ClaimableRewards] : NotificationConfig = new NotificationConfig({
        active: true,
        frequency: 604800,
        threshold: 100,
    });
    
    @API.Property(() => NotificationConfig)
    @Assert({ presence: true })
    @AssertObject({
        threshold: {
            numericality: {
                greaterThan: 0,
                lessThanOrEqualTo: 100,
            }
        }
    })
    public [NotificationType.RewardsDrop] : NotificationConfig = new NotificationConfig({
        active: true,
        frequency: 86400,
        threshold: 25,
    });
    
    @API.Property(() => NotificationConfig)
    @Assert({ presence: true })
    @AssertObject({
        threshold: {
            numericality: {
                greaterThan: 0,
                lessThanOrEqualTo: 100,
            }
        }
    })
    public [NotificationType.PoolCommissionChange] : NotificationConfig = new NotificationConfig({
        active: true,
        frequency: 86400,
        threshold: 10,
    });
    
    
    @API.Property(() => NotificationConfig)
    @Assert({ presence: true })
    public [NotificationType.UnresponsiveWorker] : NotificationConfig = new NotificationConfig({
        active: true,
        frequency: 3600,
    });
    
    @API.Property(() => NotificationConfig)
    @Assert({ presence: true })
    public [NotificationType.NodeStuck] : NotificationConfig = new NotificationConfig({
        active: true,
        frequency: 3600,
    });
    
    @API.Property(() => NotificationConfig)
    @Assert({ presence: true })
    public [NotificationType.FreePoolFunds] : NotificationConfig = new NotificationConfig({
        active: true,
        frequency: 86400,
        threshold: 10000,
    });
    
    @API.Property(() => NotificationConfig)
    @Assert({ presence: true })
    public [NotificationType.PendingWithdrawals] : NotificationConfig = new NotificationConfig({
        active: true,
        frequency: 86400,
        threshold: 0,
    });
    
    
    public constructor (data? : Partial<ObservationConfiguration>)
    {
        Trans.plainToClassFromExist(this, data);
    }
    
};
