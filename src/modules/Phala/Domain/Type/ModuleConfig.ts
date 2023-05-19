export type ModulePhalaConfig = {
    modules : {
        phala : {
            subQueryApiUrl : string,
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
