import { Action, Module, VuexModule } from 'vuex-module-decorators';
import { ObjectManager } from '@/intiv/utils/ObjectManager';
import App from '@/intiv/core/App';
import Tag from '#/App/Domain/Model/Tag';
import TagService from '#/App/Domain/Service/TagService';
import AutoRetry from '@/intiv/utils/Utility/AutoRetry';


@Module({
    dynamic: true,
    store: ObjectManager.getSingleton().getInstance(App).getVuexStore(),
    preserveState: false,
    namespaced: true,
    name: 'StakePools/RuntimeStorage',
})
export default class RuntimeStorage
    extends VuexModule<RuntimeStorage>
{
    
    #initPromise : Promise<boolean> = null;
    
    #tags : Tag[] = [];
    
    
    public get tags ()
    {
        return this.#tags;
    }
    
    
    @Action
    public async init () : Promise<boolean>
    {
        if (!this.context.state.#initPromise) {
            this.context.state.#initPromise = new Promise(async(resolve, reject) => {
                try {
                    const tagService = ObjectManager.getSingleton().getInstance(TagService);
                    this.context.state.#tags = await AutoRetry.retry(() => tagService.find());
                    
                    resolve(true);
                }
                catch (e) {
                    reject(e);
                }
            });
        }
        
        return this.context.state.#initPromise;
    }
    
}
