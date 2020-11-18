import { gql } from "@apollo/client";

export const GET_IS_AUTH = gql`
query IsAuth {
    isAuth @client
}`

export const GET_USER_DATA = gql`
query UserData {
    userData @client
}`