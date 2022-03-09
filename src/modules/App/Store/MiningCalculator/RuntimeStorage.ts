import { ApiProvider, KhalaTypes } from '#/Phala';
import { App } from '@inti5/app-frontend/App';
import { ObjectManager } from '@inti5/object-manager';
import { ApiPromise } from '@polkadot/api';
import Decimal from 'decimal.js';
import { Action, Module, VuexModule } from 'vuex-module-decorators';
import apply = Reflect.apply;



async function fetchTokenomicsParams(
    phalaApi : ApiPromise
) : Promise<typeof KhalaTypes.TokenomicParameters>
{
    const tokenomicParameters : typeof KhalaTypes.TokenomicParameters =
        <any>(await phalaApi.query.phalaMining.tokenomicParameters()).toJSON();
    
    Object.keys(tokenomicParameters)
        .filter(key => ![ 'heartbeatWindow' ].includes(key))
        .forEach(key => {
            const decimal = new Decimal(tokenomicParameters[key])
                .div(new Decimal(2).pow(64));
            tokenomicParameters[key] = decimal.toNumber();
        });
        
    return tokenomicParameters;
}

async function calculateBlockTime(
    phalaApi : ApiPromise,
    blockRange : number
) : Promise<number>
{
    const finalizedHead = await phalaApi.rpc.chain.getFinalizedHead();
    const finalizedBlockNumber = (await phalaApi.rpc.chain.getHeader(finalizedHead)).number.toNumber();
    
    let firstBlockTimestamp : number = null;
    let lastBlockTimestamp : number = null;
    
    {
        const blockHash = await phalaApi.rpc.chain.getBlockHash(finalizedBlockNumber);
        
        const { block } = await phalaApi.rpc.chain.getBlock(blockHash);
        const allEvents = await phalaApi.query.system.events.at(block.header.hash);
        
        const allExtrinsics = block.extrinsics
            .map((extrinsic, index) => ({ extrinsic, index }));
        
        const timestampExtrinsic = allExtrinsics
            .find(({ extrinsic }) => extrinsic.method.section === 'timestamp' && extrinsic.method.method === 'set');
        
        lastBlockTimestamp = parseInt(timestampExtrinsic.extrinsic.args[0].toString());
    }
    
    {
        const blockNumber = finalizedBlockNumber - blockRange;
        const blockHash = await phalaApi.rpc.chain.getBlockHash(blockNumber);
        
        const { block } = await phalaApi.rpc.chain.getBlock(blockHash);
        const allEvents = await phalaApi.query.system.events.at(block.header.hash);
        
        const allExtrinsics = block.extrinsics
            .map((extrinsic, index) => ({ extrinsic, index }));
        
        const timestampExtrinsic = allExtrinsics
            .find(({ extrinsic }) => extrinsic.method.section === 'timestamp' && extrinsic.method.method === 'set');
        
        firstBlockTimestamp = parseInt(timestampExtrinsic.extrinsic.args[0].toString());
    }
    
    return (lastBlockTimestamp - firstBlockTimestamp) / blockRange / 1000;
}

async function calculateMiningEra(
    phalaApi : ApiPromise
) : Promise<number>
{
    const finalizedHead = await phalaApi.rpc.chain.getFinalizedHead();
    
    const finalizedBlockNumber : number = <any> (await phalaApi.rpc.chain.getHeader(finalizedHead)).number.toNumber();
    const miningStartBlock : number = <any> (await phalaApi.query.phalaMining.miningStartBlock()).toJSON();
    const miningHalvingInterval : number = <any> (await phalaApi.query.phalaMining.miningHalvingInterval()).toJSON();
    
    return Math.floor((finalizedBlockNumber - miningStartBlock) / miningHalvingInterval);
}



@Module({
    dynamic: true,
    store: ObjectManager.getSingleton().getInstance(App).getVuexStore(),
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
                const phalaApi = await phalaApiProvider.getApi();
                
                this.context.state.tokenomicParameters = await fetchTokenomicsParams(phalaApi);
                this.context.state.blockTime = await calculateBlockTime(phalaApi, 200);
                this.context.state.miningEra = await calculateMiningEra(phalaApi);
                
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
