export default {
    api: {
        stats: {
            baseUrl: 'https://phala.100k.dev/stats-api/'
        },
        watchdog: {
            baseUrl: 'https://phala.100k.dev/watchdog-api/'
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
