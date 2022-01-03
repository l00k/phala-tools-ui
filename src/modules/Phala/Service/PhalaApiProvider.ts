import PolkadotApiProvider from '#/Polkadot/Service/PolkadotApiProvider';
import { ApiPromise } from '@polkadot/api';
import { khala as Khala } from '@phala/typedefs';
import { Config } from '@inti5/configuration';
import { Inject, Singleton } from '@inti5/object-manager';
import Logger from '@inti5/utils/Logger';



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
