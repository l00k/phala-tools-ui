import { Account } from '#/Phala/Domain/Model/Account';
import { StakePool } from '#/Phala/Domain/Model/StakePool';
import { ObservationConfiguration } from '#/Watchdog/Domain/Model/Observation/ObservationConfiguration';
import { ObservationNotifications } from '#/Watchdog/Domain/Model/Observation/ObservationNotifications';
import { ObservationMode } from '#/Watchdog/Domain/Type/ObservationMode';
import { Annotation as API } from '@inti5/api-frontend';
import { Assert } from '@inti5/validator/Object';
import * as Trans from 'class-transformer';


@API.Resource('Watchdog/Observation')
export class Observation
{
    
    @API.Id()
    public id : number;
    
    @API.Property(() => StakePool)
    @Assert({ presence: true })
    public stakePool : StakePool;
    
    @API.Property(() => Account)
    @Assert()
    public account : Account;
    
    @API.Property()
    @Assert({ presence: true })
    public mode : ObservationMode = ObservationMode.Delegator;
    
    
    @API.Property(() => ObservationConfiguration)
    @Assert({ presence: true })
    public config : ObservationConfiguration = new ObservationConfiguration();
    
    
    @API.Property(() => ObservationNotifications)
    public lastNotifications : ObservationNotifications = new ObservationNotifications();
    
    
    public constructor (data? : Partial<Observation>)
    {
        Trans.plainToClassFromExist(this, data);
    }
    
}
