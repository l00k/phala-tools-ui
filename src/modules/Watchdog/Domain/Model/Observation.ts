import { Account } from '#/Phala/Domain/Model/Account';
import { StakePool } from '#/Phala/Domain/Model/StakePool';
import { HistoryEntry } from '#/Stats/Domain/Model/HistoryEntry';
import { ObservationConfiguration } from '#/Watchdog/Domain/Model/Observation/ObservationConfiguration';
import { ObservationNotifications } from '#/Watchdog/Domain/Model/Observation/ObservationNotifications';
import { ObservationMode } from '#/Watchdog/Domain/Type/ObservationMode';
import { API } from '@inti5/api-frontend';
import { Type } from '@inti5/graph-typing';
import { Assert } from '@inti5/validator/Object';
import * as Trans from 'class-transformer';


@API.Resource('Watchdog/Observation')
export class Observation
{
    
    @API.Id()
    public id : number;
    
    @API.Property()
    @Assert({ presence: true })
    @Type(() => StakePool)
    public stakePool : StakePool;
    
    @API.Property()
    @Assert()
    @Type(() => Account)
    public account : Account;
    
    @API.Property()
    @Assert({ presence: true })
    public mode : ObservationMode = ObservationMode.Delegator;
    
    
    @API.Property()
    @Assert({ presence: true })
    @Type(() => ObservationConfiguration)
    public config : ObservationConfiguration = new ObservationConfiguration();
    
    
    @API.Property()
    @Type(() => ObservationNotifications)
    public lastNotifications : ObservationNotifications = new ObservationNotifications();
    
    
    public constructor (data? : Partial<Observation>)
    {
        Trans.plainToClassFromExist(this, data);
    }
    
}
