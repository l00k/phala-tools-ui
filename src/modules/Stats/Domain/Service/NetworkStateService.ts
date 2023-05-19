import { NetworkState } from '#/Stats/Domain/Model/NetworkState';
import * as Api from '@inti5/api-frontend';
import { Configuration } from '@inti5/configuration';
import { ObjectManager } from '@inti5/object-manager';
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
        const configuration = ObjectManager.getSingleton().getInstance(Configuration);
        const subQueryApiUrl = configuration.get('modules.phala.subQueryApiUrl');
    
        const networkState = new NetworkState({
            blockTime: 12,
            totalShares: 1e12,
            phaPrice: 0.1,
        });
    
        {
            const { status, data } = await axios.post(
                subQueryApiUrl,
                {
                    query: 'query GlobalState { globalStateById(id: "0") { averageBlockTime idleWorkerShares } }',
                    variables: {},
                    operationName: 'GlobalState'
                },
                {
                    validateStatus: () => true,
                }
            );
            
            if (status == 200) {
                networkState.blockTime = data.data.globalStateById.averageBlockTime / 1e3;
                networkState.totalShares = data.data.globalStateById.idleWorkerShares;
            }
        }
        
        {
            const { status, data } = await axios.get(
                'https://api.coingecko.com/api/v3/simple/price?ids=pha&vs_currencies=usd',
                {
                    validateStatus: () => true,
                }
            );
            
            if (status == 200) {
                networkState.phaPrice = data.pha.usd;
            }
        }
        
        return networkState;
    }
    
}
