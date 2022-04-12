export type ModulePhalaConfig = {
    modules : {
        phala : {
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
