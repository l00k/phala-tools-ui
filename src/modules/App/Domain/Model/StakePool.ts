import Account, { Fragments as AccountFramgents } from '#/App/Domain/Model/Account';
import { Model, AbstractModel, Property } from '@/intiv/core/Domain/Model';
import { StorageModel } from '@/intiv/core/Store';
import gql from 'graphql-tag';


export const Fragments = {
    DefaultData: gql`
${AccountFramgents.MainData}

fragment StakePoolDefaultData on StakePool {
    id
    owner {
        ...AccountMainData
    }
    balance
    share
}
`
};

@StorageModel('PhalaStats/StakePool')
@Model()
export default class StakePools
    extends AbstractModel<StakePools>
{

    @Property()
    public id : number;

    @Property()
    public onChainId : number;

    @Property()
    public owner : Account;


}
