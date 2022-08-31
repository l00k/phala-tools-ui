import { API } from '@inti5/api-frontend';
import * as Trans from 'class-transformer';


@API.Resource('Stats/HistoryEntry')
export class HistoryEntry
{
    
    @API.Id()
    public id : number;
    
    @API.Property()
    public entryNonce : number;
    
    @API.Property()
    public entryDate : Date;
    
    @API.Property()
    public commission : number;
    
    @API.Property()
    public workersNum : number;
    
    @API.Property()
    public workersActiveNum : number;
    
    @API.Property()
    public cap : number;
    
    @API.Property()
    public stakeTotal : number;
    
    @API.Property()
    public stakeFree : number;
    
    @API.Property()
    public stakeReleasing : number;
    
    @API.Property()
    public stakeRemaining : number;
    
    @API.Property()
    public withdrawals : number;
    
    
    @API.Property()
    public currentApr : number;
    
    @API.Property()
    public avgApr : number = null;
    
    
    
    public get stakeUsed () : number
    {
        return (this.stakeTotal ?? 0) - (this.stakeFree ?? 0);
    }
    
    public get stakeFreePercent () : number
    {
        return this.stakeTotal > 0
            ? this.stakeFree / this.stakeTotal
            : 0;
    }
    
    public get stakeFreeIssue () : boolean
    {
        return this.stakeFreePercent > 0.25;
    }
    
    public get stakeReleasingPercent () : number
    {
        return this.stakeTotal > 0
            ? this.stakeReleasing / this.stakeTotal
            : 0;
    }
    
    public get stakeReleasingIssue () : boolean
    {
        return this.stakeReleasingPercent > 0.25;
    }
    
    public get withdrawalsPercent () : number
    {
        return this.stakeTotal > 0
            ? this.withdrawals / this.stakeTotal
            : 0;
    }
    
    public get widthdrawalsIssue () : boolean
    {
        return this.withdrawalsPercent > 0.5;
    }
    
    
    public constructor (data? : Partial<HistoryEntry>)
    {
        Trans.plainToClassFromExist(this, data);
    }
    
}
