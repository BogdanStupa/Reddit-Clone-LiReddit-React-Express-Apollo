import { HttpLink, InMemoryCache, ApolloClient, ApolloLink, from, NormalizedCacheObject } from '@apollo/client';
import { onError } from "@apollo/client/link/error";
import Cookies from "js-cookie";
import constants from "../constants";
import { IAuthData, IUserData } from '../types';
import { getNewAccessToken } from './refresh-token';


const httpLink = new HttpLink({ 
    uri: constants.GRAPHQL.PATH as string,
    credentials: "include"
});

const authLink= new ApolloLink((operation, forward) => {
    const token = Cookies.get("access-token");
    operation.setContext(({ headers = {} }) => ({
            headers: {
                ...headers,
                authorization: token ?  `Bearer ${token}` : null
            }
        })
    );
    return forward(operation);
});


async function resetClient(client:ApolloClient<NormalizedCacheObject>) {
    await client.resetStore();
    return true;
}


const errorHandingLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if(graphQLErrors){
        for(let err of graphQLErrors){
            console.log(err);
            switch (err.extensions?.code) {
                case "UNAUTHENTICATED":
                    const oldHeaders = operation.getContext().headers;
                    const refreshToken = String(Cookies.get("refresh-token"));  
                    const userId =  Number(Cookies.get("uid"));
                    const newAccessToken = getNewAccessToken(client, { 
                        refreshToken,
                        userId 
                    });

                    operation.setContext({
                        headers: {
                        ...oldHeaders,
                        authorization: newAccessToken ?  `Bearer ${newAccessToken}` : null,
                        },
                    });
                    // retry the request, returning the new observable
                    return forward(operation);
                
                case "LOGGED_OUT":
                    resetClient(client);
                    return forward(operation);
                    
                default:
                    return forward(operation);
            }
        }
    }
    if(networkError){
        console.log(`[Network error]: ${networkError}`);
    }
});

export const client = new ApolloClient({ 
    cache: new InMemoryCache({
        typePolicies:{
            Query: {
                fields: {
                    isAuth:{
                        read():IAuthData {
                            return {
                                auth: Boolean(Cookies.get("access-token")),
                                id: Number(Cookies.get("uid")),
                                refreshToken: String(Cookies.get("refresh-token"))
                            }
                        }
                    },
                    userData: {
                        read():IUserData {
                            return {
                                username: String(Cookies.get("username")),
                                id: Number(Cookies.get("uid"))
                            }
                        }
                    },
                },
            },
        }
    }),
    link: from([authLink, errorHandingLink, httpLink])
});
