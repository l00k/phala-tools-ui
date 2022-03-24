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
        },
        watchdog: {
            login: {
                discord: {
                    authUrl: 'https://discord.com/api/oauth2/authorize?client_id=952938945887485992&redirect_uri=https%3A%2F%2Fphala.100k.dev%2Fwatchdog%2Flogin%2Fdiscord&response_type=code&scope=identify',
                },
                telegram: {
                    botName: 'KhalaWatchdogBot',
                }
            }
        }
    }
};
