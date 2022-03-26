import { App as AppBase } from '#/FrontendCore/App';
import AppComponent from '#/App/Component/AppComponent.vue';
import * as Api from '@/core/api-frontend';
import { Inject } from '@/core/object-manager';
import Vue from 'vue';


export class App
    extends AppBase
{
    
    protected _appComponent : Vue.Component = AppComponent;
    
    @Inject()
    protected _api : Api.Service;

    @Inject()
    protected _apiProvider : Api.Provider;
    
    
    protected _beforeAppSetup ()
    {
        super._beforeAppSetup();
        
        // bootstrap api
        this._api.bootstrap();
        
        // init api clients
        this._apiProvider.get('stats')
            .init({
                baseUrl: this._configuration.get('api.stats.baseUrl'),
                refreshUri: '/token/refresh',
            });
            
        this._apiProvider.get('watchdog')
            .init({
                baseUrl: this._configuration.get('api.watchdog.baseUrl'),
                refreshUri: '/token/refresh',
            });
    }
    
}
