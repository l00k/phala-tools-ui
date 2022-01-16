import { Issue } from '#/App/Domain/Model/StakePool/Issue';
import { Tag } from '#/App/Domain/Model/Tag';
import { IssueService } from '#/App/Domain/Service/IssueService';
import { TagService } from '#/App/Domain/Service/TagService';
import { EntityRuntimeCache } from '@inti5/api-frontend/EntityRuntimeCache';
import { asyncGeneratorToArray } from '@inti5/utils/asyncGeneratorToArray';
import { App } from '@inti5/app-frontend/App';
import { ObjectManager } from '@inti5/object-manager';
import { Action, Module, VuexModule } from 'vuex-module-decorators';


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
    
    public issues : Issue[] = [];
    public tags : Tag[] = [];
    
    
    @Action
    public async init () : Promise<boolean>
    {
        if (!this.context.state.initPromise) {
            const objectManager = ObjectManager.getSingleton();
            const entityRuntimeCache = objectManager.getInstance(EntityRuntimeCache);
            const tagService = objectManager.getInstance(TagService);
            const issueService = objectManager.getInstance(IssueService);
            
            this.context.state.initPromise = new Promise(async(resolve, reject) => {
                try {
                    // load tags
                    const tags = await asyncGeneratorToArray(
                        tagService.getFetcher(),
                        chunk => chunk
                    );
                    
                    entityRuntimeCache.cacheEntities(tags);
                    this.context.state.tags = tags;
                    
                    // load issues
                    const issues = await asyncGeneratorToArray(
                        issueService.getFetcher(),
                        chunk => chunk
                    );
                    
                    entityRuntimeCache.cacheEntities(issues);
                    this.context.state.issues = issues;
                    
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
