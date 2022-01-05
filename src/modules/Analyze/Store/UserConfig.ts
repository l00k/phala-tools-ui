import { App } from '@inti5/app-frontend/App';
import { StoreManager } from '@inti5/app-frontend/Store';
import { ObjectManager } from '@inti5/object-manager';
import { Module, VuexModule } from 'vuex-module-decorators';
import { Account, StakePool, Transfer } from '#/Analyze/Domain/Definition';



@Module({
    dynamic: true,
    store: ObjectManager.getSingleton().getInstance(App).getVuexStore(),
    preserveState: StoreManager.isModulePersisted('Analyze/UserConfig'),
    namespaced: true,
    name: 'Analyze/UserConfig',
})
export class UserConfig
    extends VuexModule<UserConfig>
{
    
    public accountThreshold : number = 100;
    
    public stakerThreshold : number = 5000;
    
}
