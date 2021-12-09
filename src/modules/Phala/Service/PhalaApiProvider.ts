import PolkadotApiProvider from '#/Polkadot/Service/PolkadotApiProvider';
import { ApiPromise } from '@polkadot/api';
import { khala as Khala } from '@phala/typedefs';
import { Config } from '@/intiv/utils/Configuration';
import { Inject, Singleton } from '@/intiv/utils/ObjectManager';
import { Logger } from '@/intiv/utils/Utility';



@Singleton()
export default class PhalaApiProvider
    extends PolkadotApiProvider
{

    protected static readonly SERVICE_NAME : string = 'PhalaApiProvider';


    @Config('module.phala.api.wsUrl')
    protected apiWsUrl : string = null;


    @Inject({ ctorArgs: [PhalaApiProvider.SERVICE_NAME] })
    protected logger : Logger = null;


    protected createApi () : Promise<ApiPromise>
    {
        return ApiPromise.create({
            provider: this.wsProvider,
            types: Khala,
        });
    }

}
