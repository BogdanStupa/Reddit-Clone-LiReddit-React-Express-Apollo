import { ApolloError, AuthenticationError } from "apollo-server"
import { AuthError } from "../types"


export const handleAuthErrors = (error: AuthError): never => {
    switch (error.code) {
        case "UNAUTHENTICATED":
            throw new AuthenticationError(error.message);
    
        case "LOGGED_OUT":
            throw new ApolloError(error.message, error.code);
            
        default:
            throw new ApolloError("something wrong", "UNKNOWN_AUTH_ERROR");
    }
}