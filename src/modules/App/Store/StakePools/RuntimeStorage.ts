import { Issue } from '#/App/Domain/Model/StakePool/Issue';
import { Tag } from '#/App/Domain/Model/Tag';
import { IssueService } from '#/App/Domain/Service/IssueService';
import { TagService } from '#/App/Domain/Service/TagService';
import { App } from '#/FrontendCore/App';
import { Provider } from '@/core/api-frontend';
import { ObjectManager } from '@inti5/object-manager';
import { asyncGeneratorToArray } from '@inti5/utils/asyncGeneratorToArray';
import { Action, Module, VuexModule } from 'vuex-module-decorators';


@Module({
    dynamic: true,
    store: ObjectManager.getSingleton().getService<App>('app').getVuexStore(),
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
            const apiClient = ObjectManager.getSingleton()
                .getInstance(Provider)
                .get('stats');
            
            const tagService = apiClient.getService(TagService);
            const issueService = apiClient.getService(IssueService);
            
            this.context.state.initPromise = new Promise(async(resolve, reject) => {
                try {
                    this.context.state.tags = await asyncGeneratorToArray(
                        tagService.getFetcher(),
                        chunk => chunk
                    );
                    
                    this.context.state.issues = await asyncGeneratorToArray(
                        issueService.getFetcher(),
                        chunk => chunk
                    );
                    
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
