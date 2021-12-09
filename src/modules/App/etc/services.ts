import { ApolloClient, InMemoryCache } from '@apollo/client/core';


declare const window;

export default {
    apollo: () => {
        return new ApolloClient({
            uri: window.appData.apiUrl,
            cache: new InMemoryCache()
        });
    },
};
