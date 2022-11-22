import { CoreConfig } from '#/FrontendCore/Domain/Type/ModuleConfig';
import { ModulePhalaConfig } from '#/Phala/Domain/Type/ModuleConfig';
import { ModulePolkadotConfig } from '#/Polkadot/Domain/Type/ModuleConfig';

export default {
    api: {
        baseUrl: 'http://localhost:4005'
    },
    modules: {
        phala: {
            api: {
                urls: {
                    WS: 'ws://localhost:21944/ws',
                    HTTP: 'http://localhost:21933/',
                }
            },
        },
        watchdog: {
            discord: {
                authUrl: 'https://discord.com/api/oauth2/authorize?client_id=963239858418114580&redirect_uri=http%3A%2F%2Flocalhost%3A4001%2Fwatchdog%2Flogin%2Fdiscord&response_type=code&scope=identify',
            },
            telegram: {
                botName: 'DevWatchdogBot',
            }
        }
    }
} as (
    CoreConfig
    | ModulePolkadotConfig
    | ModulePhalaConfig
);
