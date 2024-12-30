import { CoreConfig } from '#/FrontendCore/Domain/Type/ModuleConfig';
import { ModulePhalaConfig } from '#/Phala/Domain/Type/ModuleConfig';
import { ModulePolkadotConfig } from '#/Polkadot/Domain/Type/ModuleConfig';

export default {
    modules: {
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
                    WS: 'wss://phala.api.onfinality.io/public-ws'
                },
            },
            subscan: {
                baseUrl: 'https://khala.api.subscan.io/api/'
            }
        },
        watchdog: {
            discord: {
                serverInviteLink: 'https://discord.gg/GjhffpHGN6',
            }
        }
    }
} as (
    CoreConfig
    | ModulePolkadotConfig
    | ModulePhalaConfig
);
