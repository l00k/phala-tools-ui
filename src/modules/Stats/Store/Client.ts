import { App } from '#/FrontendCore/App';
import { StoreManager } from '#/FrontendCore/Store';
import { ObjectManager } from '@inti5/object-manager';
import { Mutation, Module, VuexModule } from 'vuex-module-decorators';


@Module({
    dynamic: true,
    store: ObjectManager.getSingleton().getService<App>('app').getVuexStore(),
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
