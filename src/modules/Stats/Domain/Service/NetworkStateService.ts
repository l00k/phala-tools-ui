import { NetworkState } from '#/Stats/Domain/Model/NetworkState';
import * as Api from '@inti5/api-frontend';
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
        const { status, data } = await axios.post(
            'https://squid.subsquid.io/phala-computation/graphql',
            {
                query: 'query GlobalState { globalStateById(id: "0") { averageBlockTime idleWorkerShares } }',
                variables: {},
                operationName: 'GlobalState'
            },
            {
                validateStatus: () => true,
            }
        );
        
        return new NetworkState({
            blockTime: data.data.globalStateById.averageBlockTime / 1e3,
            totalShares: data.data.globalStateById.idleWorkerShares,
            phaPrice: 0.1,
        });
    }
    
}
