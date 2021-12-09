import { InitializeSymbol, Inject, ReleaseSymbol, Singleton } from '@/intiv/utils/ObjectManager';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Config } from '@/intiv/utils/Configuration';
import { Logger } from '@/intiv/utils/Utility';


@Singleton()
export default class PolkadotApiProvider
{
    
    protected static readonly SERVICE_NAME : string = 'PolkadotApiProvider';
    
    
    @Config('module.polkadot.api.wsUrl')
    protected apiWsUrl : string;
    
    
    @Inject({ ctorArgs: [PolkadotApiProvider.SERVICE_NAME] })
    protected logger : Logger;
    
    protected wsProvider : WsProvider;
    
    protected apiPromise : Promise<ApiPromise>;
    
    #api : ApiPromise;
    
    
    public async getApi () : Promise<ApiPromise>
    {
        await this.apiPromise;
        return this.#api;
    }
    
    public [InitializeSymbol] ()
    {
        this.wsProvider = new WsProvider(this.apiWsUrl);
        
        this.wsProvider.on('connected', () => {
            this.logger.log('Connected to node.');
        });
        this.wsProvider.on('disconnected', () => {
            this.logger.log('Disconnected from node.');
        });
        
        this.apiPromise = this.createApi();
        this.apiPromise.then(api => this.#api = api);
    }
    
    public async [ReleaseSymbol] ()
    {
        if (this.#api && this.#api.isConnected) {
            await this.#api.disconnect();
        }
    }
    
    protected createApi () : Promise<ApiPromise>
    {
        return ApiPromise.create({ provider: this.wsProvider });
    }
    
}
