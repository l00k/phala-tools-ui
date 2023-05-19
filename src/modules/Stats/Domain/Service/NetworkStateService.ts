import { NetworkState } from '#/Stats/Domain/Model/NetworkState';
import * as Api from '@inti5/api-frontend';
import { Configuration } from '@inti5/configuration';
import { ObjectManager } from '@inti5/object-manager';
import { Exception } from '@inti5/utils/Exception';
import axios from 'axios';


export class NetworkStateService
    extends Api.EntityService<NetworkState>
{
    
    public static readonly ENTITY = NetworkState;
    
    public static getDefaultPagination () : Api.Domain.Pagination
    {
        return new Api.Domain.Pagination([ 1000 ], 1000);
    }
    
    
    public async getLatestNetworkState () : Promise<NetworkState>
    {
        const configuration = Configuration.getSingleton();
        const subQueryApiUrl : any = configuration.get('modules.phala.subQueryApiUrl');
    
        const networkState = new NetworkState({
            blockTime: 12,
            budgetPerBlock: 1,
            totalShares: 1e12,
            phaPrice: 0.1,
        });
    
        {
            const { status, data } = await axios.post(
                subQueryApiUrl,
                {
                    query: 'query GlobalState { globalStateById(id: "0") { averageBlockTime budgetPerBlock idleWorkerShares } }',
                    variables: {},
                    operationName: 'GlobalState'
                },
                {
                    validateStatus: () => true,
                }
            );
            
            if (status != 200) {
                throw new Exception(
                    'Could not fetch network data',
                    1684461587185
                );
            }
            
            networkState.blockTime = data.data.globalStateById.averageBlockTime / 1e3;
            networkState.budgetPerBlock = data.data.globalStateById.budgetPerBlock;
            networkState.totalShares = data.data.globalStateById.idleWorkerShares;
        }
        
        {
            const { status, data } = await axios.get(
                'https://api.coingecko.com/api/v3/simple/price?ids=pha&vs_currencies=usd',
                {
                    validateStatus: () => true,
                }
            );
            
            if (status != 200) {
                throw new Exception(
                    'Could not fetch coin price',
                    1684461595301
                );
            }
            
            networkState.phaPrice = data.pha.usd;
        }
        
        return networkState;
    }
    
}
