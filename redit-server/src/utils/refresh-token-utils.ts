import { RedisClient } from "../redis-setup";
import JWT from "jsonwebtoken";
import { JwtDataType } from "../types";
import { RefreshAccessTokenRequest } from "../resolvers/resolver-types/user";


export const verifyRefreshToken = (options: RefreshAccessTokenRequest ): Promise<JwtDataType | null>  => {
    const key = `${options.userId}:${options.refreshToken}`
    return new Promise(resolve => RedisClient.EXISTS(key, (_error, res) => {
        if(res){
            const decode = JWT.verify(options.refreshToken, process.env.SECRET_REFRESH_TOKEN_KEY!) as JwtDataType;
            resolve(decode);
        }
        resolve(null)
    }));
}


export const deleteRefreshToken = (options: RefreshAccessTokenRequest ): Promise<boolean>  => {
    const key = `${options.userId}:${options.refreshToken}`
    return new Promise(resolve => RedisClient.DEL(key, (_err, res) => resolve(Boolean(res))));
}