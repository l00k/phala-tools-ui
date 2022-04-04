import { Account } from '#/Phala/Domain/Model/Account';
import { Annotation as API } from '@inti5/api-frontend';
import * as Trans from 'class-transformer';


@API.Resource('StakePool')
@API.Cacheable({ lifetime: 15 * 60 * 1000 })
export class StakePool
{
    
    
    @API.Id()
    public id : number;
    
    
    @API.Property()
    public onChainId : number;
    
    @API.Property(() => Account)
    public owner : Account;
    
    
    public constructor (data? : Partial<StakePool>)
    {
        if (data) {
            Trans.plainToClassFromExist(this, data);
        }
    }
    
}
