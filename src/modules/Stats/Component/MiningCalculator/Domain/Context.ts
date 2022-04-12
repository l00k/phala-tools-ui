import { NetworkService } from '#/Stats/Service/NetworkService';
import { KhalaTypes } from '#/Phala';

export class Context
{
    
    public tokenomicParams : typeof KhalaTypes.TokenomicParameters;
    
    public miningEra : number = 0;
    
    public blockTime : number = 12;
    
    public totalShares : number = 0;
    
    public cpuScore : number = null;
    
    public cpuCores : number = null;
    
    public confidenceLevel : number = null;
    
    public devicePowerConsumption : number = 0;
    
    public deviceCost : number = 0;
    
    public deviceAmortisation : number = 2;
    
    public otherCosts : number = 0;
    
    public phaPrice : number;
    
    public electricityCost : number = 0.2;
    
    public commissionPercent : number = 50;
    
    public stakePersonal : number = null;
    
    public stakeDelegators : number = null;
    
    public stakeFree : number = 0;
    
    
    public get confidenceScore () : number
    {
        return NetworkService.getConfidenceScore(this.confidenceLevel);
    }
    
    public get rewardsFractionInEra () : number
    {
        return NetworkService.getRewardsFractionInEra(this.miningEra);
    }
    
    public get workerF () : number
    {
        return 1 + (this.confidenceScore * (this.tokenomicParams.re - 1));
    }
    
    public get workerCost () : number
    {
        return this.cpuScore * 0.3 / this.tokenomicParams.phaRate;
    }
    
    public get stakeMinimal () : number
    {
        const value = this.tokenomicParams.k * Math.sqrt(this.cpuScore);
        return isNaN(value)
            ? 0
            : value;
    }
    
    public get stakeMaximal () : number
    {
        const value = this.tokenomicParams.vMax
            / this.workerF
            - this.workerCost;
        return isNaN(value)
            ? 0
            : value;
    }
    
    public get commission () : number
    {
        const value = this.commissionPercent / 100;
        return isNaN(value)
            ? 0
            : value;
    }
    
    public get stakeTotalDevice () : number
    {
        const value = this.stakePersonal + this.stakeDelegators;
        return isNaN(value)
            ? 0
            : value;
    }
    
    public get stakeTotalPool () : number
    {
        const value = this.stakePersonal + this.stakeDelegators + this.stakeFree;
        return isNaN(value)
            ? 0
            : value;
    }
    
    public get ownerFraction () : number
    {
        if (!this.stakeTotalPool) {
            return 0;
        }
    
        return (this.stakePersonal + (this.stakeDelegators + this.stakeFree) * this.commission)
            / this.stakeTotalPool;
    }
    
    public get isStakeValid () : boolean
    {
        return this.stakeTotalDevice >= this.stakeMinimal
            && this.stakeTotalDevice <= this.stakeMaximal;
    }
    
    public get workerInitialV () : number
    {
        return this.workerF * (this.stakeTotalDevice + this.workerCost);
    }
    
    public get workerShare () : number
    {
        return NetworkService.calculateWorkerShare(
            this.workerInitialV,
            this.confidenceLevel,
            this.cpuScore
        );
    }
    
    public get rewardsDaily () : number
    {
        const budgetPerBlock = this.tokenomicParams.budgetPerBlock * this.rewardsFractionInEra;
        const workerRewards = this.workerShare / this.totalShares * budgetPerBlock;

        return workerRewards
            * (1 - this.tokenomicParams.treasuryRatio)
            * (24 * 3600 / this.blockTime);
    }
    
    public get ownerRewardsDaily () : number
    {
        return this.rewardsDaily * this.ownerFraction;
    }
    
    public get poolApr () : number
    {
        if (!this.stakeTotalPool) {
            return 0;
        }
        
        return this.rewardsDaily * 365
            * (1 - this.commission)
            / this.stakeTotalPool;
    }
    
}
