import { Action, Module, VuexModule } from 'vuex-module-decorators';
import { ObjectManager } from '@inti5/object-manager';
import { App } from '@inti5/app-frontend/App';
import { Tag } from '#/App/Domain/Model/Tag';
import { TagService } from '#/App/Domain/Service/TagService';
import { autoRetry } from '@inti5/utils/autoRetry';


@Module({
    dynamic: true,
    store: ObjectManager.getSingleton().getInstance(App).getVuexStore(),
    preserveState: false,
    namespaced: true,
    name: 'StakePools/RuntimeStorage',
})
export class RuntimeStorage
    extends VuexModule<RuntimeStorage>
{
    
    public initPromise : Promise<boolean> = null;
    
    public tags : Tag[] = [];
    
    
    @Action
    public async init () : Promise<boolean>
    {
        if (!this.context.state.initPromise) {
            this.context.state.initPromise = new Promise(async(resolve, reject) => {
                try {
                    const tagService = ObjectManager.getSingleton().getInstance(TagService);
                    
                    const collection = await tagService.getCollection({
                        pagination: { page: 1, itemsPerPage: 1000 }
                    });
                    this.context.state.tags = collection.items;
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
