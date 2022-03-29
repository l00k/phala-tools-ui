import { Annotation as API } from '@inti5/api-frontend';
import { Assert } from '@inti5/validator/Object';
import * as Trans from 'class-transformer';


@API.Resource('Watchdog/User/Configuration')
export class UserConfiguration
{
    
    @API.Property()
    @Assert({
        presence: true,
        numericality: {
            greaterThanOrEqualTo: 1,
            lessThanOrEqualTo: 1000000,
        },
    })
    public claimRewardsThreshold : number = 100;
    
    @API.Property()
    @Assert({
        presence: true,
        numericality: {
            greaterThanOrEqualTo: 1,
            lessThanOrEqualTo: 100,
        },
    })
    public changeCommissionThreshold : number = 1;
    
    @API.Property()
    @Assert({
        presence: true,
        numericality: {
            greaterThanOrEqualTo: 100,
        },
    })
    public contributionThreshold : number = 1000;
    
    @API.Property()
    @Assert({
        presence: true,
        numericality: {
            greaterThanOrEqualTo: 100,
        },
    })
    public withdrawalThreshold : number = 10000;
    
    @API.Property()
    @Assert({
        presence: true,
        numericality: {
            greaterThanOrEqualTo: 5,
        },
    })
    public poolPerformanceDropThreshold : number = 25;
    
    @API.Property()
    @Assert({
        presence: true,
        numericality: {
            greaterThanOrEqualTo: 0,
        },
    })
    public delayUnresponsiveWorkerNotification : number = 1;
    
    
    public constructor (data? : Partial<UserConfiguration>)
    {
        Trans.plainToClassFromExist(this, data);
    }
    
};
