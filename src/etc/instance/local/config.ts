import { CoreConfig } from '#/FrontendCore/Domain/Type/ModuleConfig';
import { ModulePhalaConfig } from '#/Phala/Domain/Type/ModuleConfig';
import { ModulePolkadotConfig } from '#/Polkadot/Domain/Type/ModuleConfig';

export default {
    api: {
        baseUrl: 'http://localhost:4005'
    },
    module: {
        phala: {
            api: {
                urls: {
                    WS: 'ws://localhost:19944/ws',
                    HTTP: 'http://localhost:19933/',
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
} as (
    CoreConfig
    | ModulePolkadotConfig
    | ModulePhalaConfig
);
