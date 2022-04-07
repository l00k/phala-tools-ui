import { Issue } from '#/Stats/Domain/Model/Issue';
import { IssueService } from '#/Stats/Domain/Service/IssueService';
import { App } from '#/FrontendCore/App';
import { Provider } from '@inti5/api-frontend';
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
    
    
    @Action
    public async init () : Promise<boolean>
    {
        if (!this.context.state.initPromise) {
            const apiClient = ObjectManager.getSingleton()
                .getInstance(Provider)
                .get();
            
            const issueService = apiClient.getService(IssueService);
            
            this.context.state.initPromise = new Promise(async(resolve, reject) => {
                try {
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
