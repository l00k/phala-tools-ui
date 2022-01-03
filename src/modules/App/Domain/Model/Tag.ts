import { AbstractModel, Model, Property } from '@inti5/app-frontend/Domain/Model';
import { StorageModel } from '@inti5/app-frontend/Store';
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
