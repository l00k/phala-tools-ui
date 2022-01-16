import { Annotation as API } from '@inti5/api';


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



abstract class AbstractEventData
{
}

export class Transfer
    extends AbstractEventData
{
}

export class CommissionChange
    extends AbstractEventData
{
    public commission : number;
    public delta : number;
}

export class Contribution
    extends AbstractEventData
{
}

export class Withdrawal
    extends AbstractEventData
{
}

export class Slash
    extends AbstractEventData
{
}

export class Halving
    extends AbstractEventData
{
}



@API.Resource()
export class Event<T extends AbstractEventData>
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
    
    @API.Property()
    public additionalData : T = <any>{};
    
}
