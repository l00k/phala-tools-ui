import { AbstractModel, Model, Property } from '@/intiv/core/Domain/Model';
import { StorageModel } from '@/intiv/core/Store';
import gql from 'graphql-tag';


export const Fragments = {
    DefaultData: gql`
fragment TagDefaultData on Tag {
    id
    label
    color
}
`
};

@StorageModel('PhalaStats/Tag')
@Model()
export default class Tag
    extends AbstractModel<Tag>
{
    
    @Property()
    public id : number;
    
    @Property()
    public name : string = '';
    
    @Property()
    public color : string = '';
    
}
