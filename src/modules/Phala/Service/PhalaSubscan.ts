import { PolkadotSubscan } from '#/Polkadot/Service/PolkadotSubscan';
import { Config } from '@inti5/configuration';
import { Inject, Singleton } from '@inti5/object-manager';
import { Logger } from '@inti5/utils/Logger';



@Singleton()
export class PhalaSubscan
    extends PolkadotSubscan
{
    
    protected static readonly SERVICE_NAME : string = 'PhalaSubscan';
    
    @Config('module.phala.subscan.baseUrl')
    protected subscanBaseUrl : string;
    
    @Inject({ ctorArgs: [ PhalaSubscan.SERVICE_NAME ] })
    protected logger : Logger;
    
}
