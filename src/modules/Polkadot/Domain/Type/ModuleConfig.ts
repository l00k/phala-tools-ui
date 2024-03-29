export type ModulePolkadotConfig = {
    modules : {
        polkadot : {
            api : {
                urls : {
                    WS : string,
                    HTTP : string,
                }
            }
            subscan : {
                baseUrl : string
            }
        }
    }
}
