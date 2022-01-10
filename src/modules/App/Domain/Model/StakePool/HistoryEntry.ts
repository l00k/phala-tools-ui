import { Annotation as API } from '@inti5/api-frontend';


@API.Resource()
export class HistoryEntry
{
    
    @API.Property()
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
    public stakeTotal : number;
    
    @API.Property()
    public stakeFree : number;
    
    @API.Property()
    public stakeReleasing : number;
    
    @API.Property()
    public vTotal : number;
    
    @API.Property()
    public pTotal : number;
    
    @API.Property()
    public rewardsTotal : number;
    
    @API.Property()
    public currentRewardsDaily : number;
    
    @API.Property()
    public currentApr : number;
    
    @API.Property()
    public avgRewardsDaily : number;
    
    @API.Property()
    public avgApr : number;
    
    
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
    
}
