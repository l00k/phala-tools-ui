import { CoreConfig } from '#/FrontendCore/Domain/Type/ModuleConfig';
import { ModulePhalaConfig } from '#/Phala/Domain/Type/ModuleConfig';
import { ModulePolkadotConfig } from '#/Polkadot/Domain/Type/ModuleConfig';

export default {
    api: {
        baseUrl: `https://khala.100k.dev/api/`
    },
    module: {
        watchdog: {
            login: {
                discord: {
                    authUrl: `https://discord.com/api/oauth2/authorize?client_id=952938945887485992&redirect_uri=https%3A%2F%2Fkhala.100k.dev%2Fwatchdog%2Flogin%2Fdiscord&response_type=code&scope=identify`,
                },
                telegram: {
                    botName: 'KhalaWatchdogBot',
                }
            }
        }
    }
} as (
    CoreConfig
    | ModulePolkadotConfig
    | ModulePhalaConfig
);
