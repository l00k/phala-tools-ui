export default {
    api: {
        client: {
            baseURL: 'https://phala.100k.dev:4004'
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
                wsUrl: 'ws://localhost:19944/ws',
            },
            subscan: {
                baseUrl: 'https://khala.api.subscan.io/api/'
            }
        }
    }
};
