import { CoreConfig } from '#/FrontendCore/Domain/Type/ModuleConfig';
import { ModulePhalaConfig } from '#/Phala/Domain/Type/ModuleConfig';
import { ModulePolkadotConfig } from '#/Polkadot/Domain/Type/ModuleConfig';

export default {
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
        }
    }
} as (
    CoreConfig
    | ModulePolkadotConfig
    | ModulePhalaConfig
);
