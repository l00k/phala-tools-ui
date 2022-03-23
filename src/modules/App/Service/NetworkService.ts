import * as Phala from '#/Phala';
import Decimal from 'decimal.js';

export class NetworkService
{
    
    protected static CONFIDENCE_SCORE_MAP = { 1: 1, 2: 1, 3: 1, 4: 0.8, 5: 0.7 };
    
    public static getConfidenceScore (
        confidenceLevel : number
    ) : number
    {
        return NetworkService.CONFIDENCE_SCORE_MAP[confidenceLevel];
    }
    
    public static getRewardsFractionInEra (
        miningEra : number
    ) : number
    {
        return Math.pow(0.75, miningEra);
    }
    
    public static calculateWorkerShare (
        v : number,
        confidenceLevel : number,
        pInstant : number
    ) : number
    {
        const confidenceScore = this.getConfidenceScore(confidenceLevel);
        return Math.sqrt(v ** 2 + (2 * pInstant * confidenceScore) ** 2);
    }
    
}
