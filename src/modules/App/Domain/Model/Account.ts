import Tag from '#/App/Domain/Model/Tag';
import { AbstractModel, Model, Property } from '@/intiv/core/Domain/Model';
import { StorageModel } from '@/intiv/core/Store';
import gql from 'graphql-tag';


export const Fragments = {
    DefaultData: gql`
fragment AccountDefaultData on Account {
    id
    address
    identity
    alias
    tags { id }
    balanceTotal
    balanceTransferable
    balanceStaked
}
`,
    MainData: gql`
fragment AccountMainData on Account {
    id
    address
    identity
    alias
    tags { id }
}
`
};

@StorageModel('PhalaStats/Account')
@Model()
export default class Account
    extends AbstractModel<Account>
{
    
    @Property()
    public id : number;
    
    @Property()
    public address : string;
    
    @Property()
    public identity : string = '';
    
    @Property()
    public alias : string = '';
    
    @Property({ arrayOf: Tag })
    public tags : Tag[] = [];
    
    
    public get displayName () : string
    {
        if (this.alias) {
            return this.alias + (this.identity ? ` (${this.identity})` : '');
        }
        else if (this.identity) {
            return this.identity;
        }
        else {
            return this.address;
        }
    }
    
}
