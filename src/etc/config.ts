export default {
    api: {
        baseUrl: 'https://phala.100k.dev/api/'
    },
    module: {
        polkadot: {
            api: {
                urls: {
                    WS: 'wss://rpc.polkadot.io'
                }
            },
            subscan: {
                baseUrl: 'https://polkadot.api.subscan.io/api/'
            }
        },
        phala: {
            api: {
                urls: {
                    WS: 'wss://khala-api.phala.network/ws'
                },
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
