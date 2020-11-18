import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";
import { RefreshAccessTokenRequest } from "../generated/graphql";

const fetchNewAccessToken = (client: ApolloClient<NormalizedCacheObject> , options: RefreshAccessTokenRequest) => {
    const REFRESH_ACCESS_TOKEN = gql`
        query RefreshAccessToken($options: RefreshAccessTokenRequest!){
            refreshAccessToken(options: $options){
                newAccessToken
            }
        }
    `;

    return new Promise(resolve => resolve(
        client.query({
            query: REFRESH_ACCESS_TOKEN,
            fetchPolicy: 'network-only',
            variables: { options }
        })
    ));
};

export const getNewAccessToken = async (client:ApolloClient<NormalizedCacheObject>, options: RefreshAccessTokenRequest ) => {
    const res =  await fetchNewAccessToken(client, options);
    return res;
}
