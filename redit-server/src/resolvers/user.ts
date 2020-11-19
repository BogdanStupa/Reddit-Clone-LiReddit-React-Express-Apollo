import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import argon2 from "argon2";
import { RedisClient } from "../redis-setup";
import { createAccessJwtToken, createRefreshJwtToken } from "../utils/jwt-utils";
import { ApolloError } from "apollo-server";
import { verifyRefreshToken, deleteRefreshToken } from "../utils/refresh-token-utils";
import { RefreshAccessTokenRequest, RefreshAccessTokenResponse, UsernamePasswordInput, UserResponse } from "./resolver-types/user";
import { COOKIE_ACCESS_TOKEN_NAME, COOKIE_REFRESH_TOKEN_NAME, COOKIE_USER_ID_NAME, COOKIE_USERNAME_NAME } from "../constants";
import { authValidation } from "../data-validation/auth";



@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse) 
    async register(
        @Arg("options") options: UsernamePasswordInput): Promise<UserResponse> {
        const authInputError = authValidation(options);
        if(authInputError) return authInputError;
        
        const hashedPassword = await argon2.hash(options.password);
        let user = null;
        try {
            user = await User.create({ 
                username: options.username,
                password: hashedPassword
            }).save();
        }catch(error){
            //duplicate username error
            if(error.code === "23505"){
                return {
                    errors: [{
                        field: "username",
                        message: "username already taken"
                    }]
                }
            }
            return {
                errors: [{
                    field: "some error",
                    message: "something wrong"
                }]
            }
        }
        return { 
            user: { 
                username: user.username,
                id: user.id
            } 
        };  
    }


    @Mutation(() => UserResponse) 
    async login(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { res }: MyContext
    ): Promise<UserResponse> {
        const user = await User.findOne({ where: { username: options.username } });   
        if(!user){
            return {
                errors: [{
                    field: "username",
                    message: "that username doesn't exist"
                }],
            }
        }  
        if(! await argon2.verify(user.password, options.password)){
            return {
                errors: [{
                    field: "password",
                    message: "incorrect password"
                }],
            }
        }

        let accessToken = null;
        let refreshToken = null;
        try{
            accessToken = createAccessJwtToken({
                id: user.id,
                username: user.username
            });
            refreshToken = createRefreshJwtToken({
                id: user.id,
                username: user.username
            });

            await RedisClient.SETEX(`${user.id}:${refreshToken}`, 60 * 60 * 12 * 30, `${refreshToken}`); //30 days
        }catch{
            return {
                errors: [{
                    field: "some field",
                    message: "some error in creation user token"
                }]
            };
        }
        res.cookie(COOKIE_ACCESS_TOKEN_NAME, accessToken);
        res.cookie(COOKIE_REFRESH_TOKEN_NAME, refreshToken);
        res.cookie(COOKIE_USER_ID_NAME, user.id);
        res.cookie(COOKIE_USERNAME_NAME, user.username);

        return { 
            user: { 
                username: user.username,
                id: user.id
            } 
        };
    }

    @Query(() => RefreshAccessTokenResponse)
    async refreshAccessToken(
        @Arg("options") options: RefreshAccessTokenRequest,
        @Ctx() { res } : MyContext 
    ): Promise<RefreshAccessTokenResponse>{
        let decode = await verifyRefreshToken(options);
        if(!decode || !decode.id || !decode.username) throw new ApolloError("You are logged out", "LOGGED_OUT");
        
        const newAccessToken = await createAccessJwtToken({ id: decode.id, username: decode.username });

        res.cookie("access-token", newAccessToken);
        return { newAccessToken }
    }

    @Mutation(() => Boolean)
    async logout(
        @Arg("options") options: RefreshAccessTokenRequest,
        @Ctx() { res }: MyContext
    ): Promise<boolean>{
        await res.clearCookie(COOKIE_ACCESS_TOKEN_NAME);
        await res.clearCookie(COOKIE_REFRESH_TOKEN_NAME);
        await deleteRefreshToken(options);
        return true;
    }

    @Query(() => [User], { nullable: true }) 
    async getUsers(): Promise<User[] | null> {
        return User.find();
    }
}