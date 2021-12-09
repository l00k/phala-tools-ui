import App from '@/intiv/core/App';
import { StoreManager } from '@/intiv/core/Store';
import { ObjectManager } from '@/intiv/utils/ObjectManager';
import { Module, VuexModule } from 'vuex-module-decorators';
import { Account, StakePool, Transfer } from '#/Analyze/Domain/Definition';



@Module({
    dynamic: true,
    store: ObjectManager.getSingleton().getInstance(App).getVuexStore(),
    preserveState: StoreManager.isModulePersisted('Analyze/UserConfig'),
    namespaced: true,
    name: 'Analyze/UserConfig',
})
export default class UserConfig
    extends VuexModule<UserConfig>
{
    
    public accountThreshold : number = 100;
    
    public stakerThreshold : number = 5000;
    
}
