import { App } from '#/FrontendCore/App';
import { ApiProvider, KhalaTypes } from '#/Phala';
import { ApiMode } from '#/Polkadot';
import { ObjectManager } from '@inti5/object-manager';
import { ApiPromise } from '@polkadot/api';
import Decimal from 'decimal.js';
import { Action, Module, VuexModule } from 'vuex-module-decorators';



async function fetchTokenomicsParams(
    phalaApi : ApiPromise
) : Promise<typeof KhalaTypes.TokenomicParameters>
{
    const tokenomicParameters : any = (
        await phalaApi.query.phalaComputation.tokenomicParameters()
    ).toJSON();
    
    Object.keys(tokenomicParameters)
        .filter(key => ![ 'heartbeatWindow' ].includes(key))
        .forEach(key => {
            const decimal = new Decimal(tokenomicParameters[key])
                .div(new Decimal(2).pow(64));
            tokenomicParameters[key] = decimal.toNumber();
        });
        
    return tokenomicParameters;
}


@Module({
    dynamic: true,
    store: ObjectManager.getSingleton().getService<App>('app').getVuexStore(),
    preserveState: false,
    namespaced: true,
    name: 'MiningCalculator/RuntimeStorage',
})
export class RuntimeStorage
    extends VuexModule<RuntimeStorage>
{
    
    public initPromise : Promise<boolean> = null;
    
    public tokenomicParameters : typeof KhalaTypes.TokenomicParameters;
    public blockTime : number;
    public miningEra : number;
    
    
    @Action
    public async init () : Promise<boolean>
    {
        if (this.context.state.initPromise) {
            return this.context.state.initPromise;
        }
        
        const objectManager = ObjectManager.getSingleton();
        const phalaApiProvider = objectManager.getInstance(ApiProvider);
        
        this.context.state.initPromise = new Promise(async(resolve, reject) => {
            try {
                const phalaApi = await phalaApiProvider.getApi(ApiMode.WS);
                
                this.context.state.tokenomicParameters = await fetchTokenomicsParams(phalaApi);
                
                resolve(true);
            }
            catch (e) {
                console.error(e);
                reject(e);
            }
        });
        
        return this.context.state.initPromise;
    }
    
}
