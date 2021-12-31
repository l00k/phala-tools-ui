import Tag, { Fragments as TagFragments } from '#/App/Domain/Model/Tag';
import { FilterQuery, Pagination } from '@/intiv/core/GraphQL/Struct';
import { Inject } from '@/intiv/utils/ObjectManager';
import gql from 'graphql-tag';
import GraphQLApi from '#/App/Service/GraphQLApi';


export default class TagService
{

    @Inject()
    protected graphQLApi : GraphQLApi;


    public async find(
        filters : FilterQuery<Tag> = {},
        pagination : Pagination = new Pagination()
    ) : Promise<Tag[]>
    {
        const { getTags: tags } = await this.graphQLApi.query(gql`
            query {
                getTags {
                    ...TagDefaultData
                }
            }
            ${ TagFragments.DefaultData }
        `);
        if (!tags) {
            return [];
        }

        return tags
            .map(tag => new Tag(tag));
    }

}
