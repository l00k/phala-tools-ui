export default {
    api: {
        client: {
            baseURL: 'https://phala.100k.dev/api/'
        }
    },
    module: {
        polkadot: {
            api: {
                wsUrl: 'wss://rpc.polkadot.io'
            },
            subscan: {
                baseUrl: 'https://polkadot.api.subscan.io/api/'
            }
        },
        phala: {
            api: {
                wsUrl: 'wss://khala-api.phala.network/ws',
            },
            subscan: {
                baseUrl: 'https://khala.api.subscan.io/api/'
            }
        }
    }
};
