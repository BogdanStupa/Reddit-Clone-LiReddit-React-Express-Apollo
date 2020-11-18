import JWT from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { ReqType, AuthType, AuthError } from "../types";
import { ApolloError } from "apollo-server";

const AuthorizationError = (error: AuthError): never => {
    throw new ApolloError(error.message, error.code);
}

export const isAuth = async (req: ReqType , _res: Response, next: NextFunction) => {
    try{
        if(!req.headers.authorization){
            throw AuthorizationError({ message: "Not authorizated", code: "LOGGED_OUT" });
        }
        const token = req.headers.authorization.split(" ")[1];
        if(token){
            try{
                const decode = await JWT.verify(token, process.env.SECRET_ACCESS_TOKEN_KEY!) as AuthType;
                req.currentUser = {
                    id: decode.id,
                    username: decode.username
                };
                next();
                return;
            }catch(error){
                throw AuthorizationError({ message: "Invalid token", code: "UNAUTHENTICATED"});
            }
        }else{
            throw AuthorizationError({ message: "Token is not supplied", code: "LOGGED_OUT"});
        }
    }catch(error){
        req.authError = {
            code: error.extensions.code,
            message: error.message
        }
        next();
        return;
    }
}