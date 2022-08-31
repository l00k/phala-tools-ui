import { ObservationType } from '#/Watchdog/Domain/Type/ObservationType';
import { API } from '@inti5/api-frontend';
import { Type } from '@inti5/graph-typing';
import { Assert, AssertObject } from '@inti5/validator/Object';
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
    
    @API.Property()
    @Assert({ presence: true })
    @AssertObject({
        threshold: {
            numericality: {
                greaterThan: 0,
            }
        }
    })
    @Type(() => NotificationConfig)
    public [ObservationType.ClaimableRewards] : NotificationConfig = new NotificationConfig({
        active: true,
        frequency: 604800,
        threshold: 100,
    });
    
    @API.Property()
    @Assert({ presence: true })
    @AssertObject({
        threshold: {
            numericality: {
                greaterThan: 0,
                lessThanOrEqualTo: 100,
            }
        }
    })
    @Type(() => NotificationConfig)
    public [ObservationType.RewardsDrop] : NotificationConfig = new NotificationConfig({
        active: true,
        frequency: 86400,
        threshold: 25,
    });
    
    @API.Property()
    @Assert({ presence: true })
    @AssertObject({
        threshold: {
            numericality: {
                greaterThan: 0,
                lessThanOrEqualTo: 100,
            }
        }
    })
    @Type(() => NotificationConfig)
    public [ObservationType.PoolCommissionChange] : NotificationConfig = new NotificationConfig({
        active: true,
        frequency: 86400,
        threshold: 10,
    });
    
    
    @API.Property()
    @Assert({ presence: true })
    @AssertObject({
        threshold: {
            numericality: {
                greaterThanOrEqualTo: 1,
            }
        }
    })
    @Type(() => NotificationConfig)
    public [ObservationType.UnresponsiveWorker] : NotificationConfig = new NotificationConfig({
        active: true,
        frequency: 3600,
        threshold: 1,
    });
    
    @API.Property()
    @Assert({ presence: true })
    @Type(() => NotificationConfig)
    public [ObservationType.StuckedNode] : NotificationConfig = new NotificationConfig({
        active: true,
        frequency: 3600,
    });
    
    @API.Property()
    @Assert({ presence: true })
    @Type(() => NotificationConfig)
    public [ObservationType.FreePoolFunds] : NotificationConfig = new NotificationConfig({
        active: true,
        frequency: 86400,
        threshold: 10000,
    });
    
    @API.Property()
    @Assert({ presence: true })
    @Type(() => NotificationConfig)
    public [ObservationType.PendingWithdrawals] : NotificationConfig = new NotificationConfig({
        active: true,
        frequency: 86400,
        threshold: 0,
    });
    
    
    public constructor (data? : Partial<ObservationConfiguration>)
    {
        Trans.plainToClassFromExist(this, data);
    }
    
};
