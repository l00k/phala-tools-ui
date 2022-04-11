import AppComponent from '#/App/Component/AppComponent.vue';
import { App as AppBase } from '#/FrontendCore/App';
import * as Api from '@inti5/api-frontend';
import { Inject } from '@inti5/object-manager';
import Vue from 'vue';


export class App
    extends AppBase
{
    
    protected _appComponent : Vue.Component = null;
    
    @Inject()
    protected _api : Api.Service;
    
    @Inject()
    protected _apiProvider : Api.Provider;
    
    
    protected _beforeAppSetup ()
    {
        super._beforeAppSetup();
        
        // setup proper APP component
        this._appComponent = AppComponent;
        
        // bootstrap api
        this._api.bootstrap();
        
        // init api clients
        this._apiProvider.get('main')
            .init({
                baseUrl: this._configuration.get('api.baseUrl'),
                refreshUri: '/token/refresh',
            });
    }
    
}
