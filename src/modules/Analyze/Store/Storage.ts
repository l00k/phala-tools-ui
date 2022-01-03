import App from '@inti5/app-frontend/App';
import { StoreManager } from '@inti5/app-frontend/Store';
import { ObjectManager } from '@inti5/object-manager';
import { Action, Module, VuexModule } from 'vuex-module-decorators';
import { Account, StakePool, Transfer } from '#/Analyze/Domain/Definition';



type AssocTable<T> = { [key : number] : T };

type DataAsset = {
    accounts: Account[],
    stakePools: StakePool[],
    transfers: Transfer[],
}


@Module({
    dynamic: true,
    store: ObjectManager.getSingleton().getInstance(App).getVuexStore(),
    namespaced: true,
    name: 'Analyze/Storage',
})
export default class Storage
    extends VuexModule<Storage>
{

    protected initPromise : Promise<boolean> = null;

    public accounts : AssocTable<Account> = {};
    
    public stakePools : AssocTable<StakePool> = {};

    public transfersDirect : AssocTable<AssocTable<number>> = {};
    
    public transfersInverse : AssocTable<AssocTable<number>> = {};
    

    @Action
    public async init(): Promise<boolean>
    {
        if (!this.context.state.initPromise) {
            this.context.state.initPromise = new Promise(async(resolve, reject) => {
                try {
                    const data : DataAsset = <any> await import('@/assets/data.json');
                    
                    this.context.state.accounts = Object.fromEntries(data.accounts.map(account => [ account.id, account ]));
                    this.context.state.stakePools = <any>Object.fromEntries(data.stakePools.map(stakePool => [ stakePool.id, stakePool ]));
            
                    data.transfers.forEach((transfer : Transfer) => {
                        if (!this.context.state.transfersDirect[transfer.from]) {
                            this.context.state.transfersDirect[transfer.from] = {};
                        }
                        this.context.state.transfersDirect[transfer.from][transfer.to] = transfer.amount;
            
                        if (!this.context.state.transfersInverse[transfer.to]) {
                            this.context.state.transfersInverse[transfer.to] = {};
                        }
                        this.context.state.transfersInverse[transfer.to][transfer.from] = transfer.amount;
                    });
                    
                    resolve(true);
                }
                catch (e) {
                    reject(e);
                }
            });
        }

        return this.context.state.initPromise;
    }
}
