import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { DocumentNode } from 'graphql';
import { Inject } from '@/intiv/utils/ObjectManager';


type Variables = {
    [variable: string]: any
};

export default class MainApi
{

    @Inject({ name: 'apollo' })
    protected apollo : ApolloClient<InMemoryCache>;

    public async query(
        query : DocumentNode,
        variables : Variables = {}
    ) : Promise<any>
    {
        const { data } = await this.apollo.query({ query, variables });
        if (!data) {
            return [];
        }

        return data;
    }

}
