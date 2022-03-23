import { App as AppBase } from '#/FrontendCore/App';
import AppComponent from '#/App/Component/AppComponent.vue';
import * as Api from '@/core/api-frontend';
import { Inject } from '@/core/object-manager';
import Vue from 'vue';


export class App
    extends AppBase
{
    
    protected appComponent : Vue.Component = AppComponent;
    
    @Inject()
    protected api : Api.Service;

    @Inject()
    protected apiProvider : Api.Provider;
    
    
    protected _beforeAppSetup ()
    {
        super._beforeAppSetup();
        
        // bootstrap api
        this.api.bootstrap();
        
        // init api clients
        this.apiProvider.get('stats')
            .setBaseUrl(this.configuration.get('api.stats.baseUrl'))
            ;
            
        this.apiProvider.get('watchdog')
            .setBaseUrl(this.configuration.get('api.watchdog.baseUrl'))
            ;
    }
    
}
