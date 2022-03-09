import { App } from '@inti5/app-frontend/App';
import { StoreManager } from '@inti5/app-frontend/Store';
import { ObjectManager } from '@inti5/object-manager';
import { Module, Mutation, VuexModule } from 'vuex-module-decorators';


@Module({
    dynamic: true,
    store: ObjectManager.getSingleton().getInstance(App).getVuexStore(),
    preserveState: StoreManager.isModulePersisted('AprCalculator/LocalStorage'),
    namespaced: true,
    name: 'AprCalculator/LocalStorage',
})
export class LocalStorage
    extends VuexModule<LocalStorage>
{
    
    public networkShares : number;
    
    
    @Mutation
    public setNetworkShares (networkShares : number)
    {
        this.networkShares = networkShares;
    }
    
}
