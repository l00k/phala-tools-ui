import { App } from '@inti5/app-frontend/App';
import { StoreManager } from '@inti5/app-frontend/Store';
import { ObjectManager } from '@inti5/object-manager';
import { Mutation, Module, VuexModule } from 'vuex-module-decorators';


@Module({
    dynamic: true,
    store: ObjectManager.getSingleton().getInstance(App).getVuexStore(),
    preserveState: StoreManager.isModulePersisted('App/Client'),
    namespaced: true,
    name: 'App/Client',
})
export default class ContextStore
    extends VuexModule<ContextStore>
{
    
    public finishedTours : string[] = [];
    
    @Mutation
    public finishTour (tourName : string)
    {
        this.finishedTours.push(tourName);
    }
    
}
