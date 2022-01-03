import { Inject, Singleton } from '@inti5/object-manager';
import { Config } from '@inti5/configuration';
import Logger from '@inti5/utils/Logger';
import PolkadotSubscan from '#/Polkadot/Service/PolkadotSubscan';



@Singleton()
export default class PhalaSubscan
    extends PolkadotSubscan
{
    
    protected static readonly SERVICE_NAME : string = 'PhalaSubscan';
    
    @Config('module.phala.subscan.baseUrl')
    protected subscanBaseUrl : string = null;
    
    @Inject({ ctorArgs: [PhalaSubscan.SERVICE_NAME] })
    protected logger : Logger = null;
    
}
