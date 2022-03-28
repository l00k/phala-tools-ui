import { NotificationType } from '#/Watchdog/Domain/Model/StakePool/Observation/ObservationNotifications';
import { Annotation as API } from '@inti5/api-frontend';


@API.Resource('Watchdog/StakePool/Observation/NotificationConfig')
export class NotificationConfig
{
    
    @API.Property()
    public active : boolean;
    
    @API.Property()
    public frequency : number;
    
    @API.Property()
    public threshold : number;
    
}


@API.Resource('Watchdog/StakePool/Observation/Configuration')
export class ObservationConfiguration
{

    @API.Property(() => NotificationConfig)
    [NotificationType.ClaimableRewards]: NotificationConfig = new NotificationConfig();

    @API.Property(() => NotificationConfig)
    [NotificationType.RewardsDrop]: NotificationConfig = new NotificationConfig();

};
