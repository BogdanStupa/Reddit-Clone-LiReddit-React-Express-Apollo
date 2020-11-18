import { gql } from "@apollo/client";


export const refreshAccessTokenQuery = gql`
    query RefreshAccessToken($options: RefreshAccessTokenRequest!){
        refreshAccessToken(options: $options){
            newAccessToken
        }
    }
`