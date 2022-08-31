import { Account } from '#/Phala/Domain/Model/Account';
import { API } from '@inti5/api-frontend';
import { Type } from '@inti5/graph-typing';
import * as Trans from 'class-transformer';


@API.Resource('StakePool')
export class StakePool
{
    
    
    @API.Id()
    public id : number;
    
    
    @API.Property()
    public onChainId : number;
    
    @API.Property()
    @Type(() => Account)
    public owner : Account;
    
    
    public constructor (data? : Partial<StakePool>)
    {
        if (data) {
            Trans.plainToClassFromExist(this, data);
        }
    }
    
}
