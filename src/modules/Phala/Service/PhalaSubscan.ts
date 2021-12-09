import { Inject, Singleton } from '@/intiv/utils/ObjectManager';
import { Config } from '@/intiv/utils/Configuration';
import { Logger } from '@/intiv/utils/Utility';
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
