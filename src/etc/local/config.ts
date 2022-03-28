export default {
    api: {
        stats: {
            baseUrl: 'http://localhost:4004'
        },
        watchdog: {
            baseUrl: 'http://localhost:4005',
        }
    },
    module: {
        phala: {
            api: {
                urls: {
                    WS: 'ws://localhost:19944/ws'
                }
            },
        },
        watchdog: {
            login: {
                discord: {
                    authUrl: 'https://discord.com/api/oauth2/authorize?client_id=952938945887485992&redirect_uri=http%3A%2F%2Flocalhost%3A4001%2Fwatchdog%2Flogin%2Fdiscord&response_type=code&scope=identify',
                },
                telegram: {
                    botName: 'DevWatchdogBot',
                }
            }
        }
    }
};
