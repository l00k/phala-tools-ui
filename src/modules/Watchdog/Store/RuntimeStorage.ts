import { App } from '#/FrontendCore/App';
import { User } from '#/Watchdog/Domain/Model/User';
import { UserService } from '#/Watchdog/Domain/Service/UserService';
import { Provider } from '@inti5/api-frontend';
import { ObjectManager } from '@inti5/object-manager';
import { Action, Module, VuexModule } from 'vuex-module-decorators';


@Module({
    dynamic: true,
    store: ObjectManager.getSingleton().getService<App>('app').getVuexStore(),
    preserveState: false,
    namespaced: true,
    name: 'Watchdog/RuntimeStorage',
})
export class RuntimeStorage
    extends VuexModule<RuntimeStorage>
{
    
    public initPromise : Promise<boolean> = null;
    
    public isLoggedIn : boolean = false;
    
    public user : User;
    
    
    @Action
    public async init () : Promise<boolean>
    {
        if (!this.context.state.initPromise) {
            const apiClient = ObjectManager.getSingleton()
                .getInstance(Provider)
                .get();
            const userService = apiClient.getService(UserService);
            
            this.context.state.initPromise = new Promise(async(resolve, reject) => {
                try {
                    this.context.state.isLoggedIn = !!apiClient.getAuthData();
                    
                    if (this.context.state.isLoggedIn) {
                        this.context.state.user = await userService.getMe();
                    }
                    
                    resolve(true);
                }
                catch (e) {
                    console.error(e);
                    reject(e);
                }
            });
        }
        
        return this.context.state.initPromise;
    }
    
}
