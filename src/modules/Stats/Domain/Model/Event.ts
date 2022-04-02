import { Annotation as API } from '@inti5/api';
import * as Trans from 'class-transformer';


export enum EventType
{
    Transfer = 'transfer',
    
    CommissionChange = 'commissionChange',
    Contribution = 'contribution',
    Withdrawal = 'withdrawal',
    Slash = 'slash',
    Halving = 'halving',
    
    BadBehavior = 'badBehavior',
}


abstract class AbstractEventData {}

export class Transfer
    extends AbstractEventData {}

export class Contribution
    extends AbstractEventData {}

export class Withdrawal
    extends AbstractEventData {}

export class Slash
    extends AbstractEventData {}

export class Halving
    extends AbstractEventData {}

export class CommissionChange
    extends AbstractEventData
{
    public commission : number;
    public delta : number;
}


@API.Resource()
class EventAdditionalData
{
    
    @API.Property()
    public commission : number;
    
    @API.Property()
    public delta : number;
    
}


@API.Resource('Stats/Event')
export class Event<T extends AbstractEventData = any>
{
    
    @API.Id()
    public id : number;
    
    @API.Property()
    public blockNumber : number;
    
    @API.Property()
    public blockDate : Date;
    
    @API.Property(() => String)
    public type : EventType = null;
    
    @API.Property()
    public amount : number = 0;
    
    @API.Property(() => EventAdditionalData)
    public additionalData : T = <any>{};
    
    
    public constructor (data? : Partial<Event>)
    {
        Trans.plainToClassFromExist(this, data);
    }
    
}
