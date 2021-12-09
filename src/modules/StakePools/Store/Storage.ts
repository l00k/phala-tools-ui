import { Action, Module, VuexModule } from 'vuex-module-decorators';
import { ObjectManager } from '@/intiv/utils/ObjectManager';
import App from '@/intiv/core/App';


@Module({
    dynamic: true,
    store: ObjectManager.getSingleton().getInstance(App).getVuexStore(),
    preserveState: false,
    namespaced: true,
    name: 'StakePools/Storage',
})
export default class Storage
    extends VuexModule<Storage>
{
    
    protected initPromise : Promise<boolean> = null;
    
    
    @Action
    public async init () : Promise<boolean>
    {
        if (!this.context.state.initPromise) {
            this.context.state.initPromise = new Promise(async(resolve, reject) => {
                try {
                
                
                
                
                    resolve(true);
                }
                catch (e) {
                    reject(e);
                }
            });
        }
        
        return this.context.state.initPromise;
    }
    
}
