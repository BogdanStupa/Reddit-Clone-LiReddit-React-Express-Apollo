import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from "argon2";


@InputType()
class UsernamePasswordInput {
    @Field()
    username: string;

    @Field()
    password: string;
}

@ObjectType()
class FieldError{
    @Field()
    field: string;

    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}



@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse) 
    async register(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { em }: MyContext
    ): Promise<UserResponse> {
        if(options.username.length < 5 || options.username.length > 12){
            return {
                errors: [{
                    field: "username",
                    message: "length must be between 5 and 12"
                }]
            }
        }
        if(options.password.length < 5 || options.password.length > 12){
            return {
                errors: [{
                    field: "password",
                    message: "length must be between 5 and 12"
                }]
            }
        }

        const hashedPassword = await argon2.hash(options.password);
        const user = await em.create(User, { 
            username: options.username,
            password: hashedPassword
        }); 
        try {
            await em.persistAndFlush(user);         
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
        return { user };  
    }

    @Mutation(() => UserResponse) 
    async login(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, { username: options.username });   
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

        // store user in session 
        // this will set a cookie on the user
        // keep them logged in 
        req.session.userId = user.id;

        return { user };
    }

    @Query(() => [User], { nullable: true }) 
    async getUsers(
        @Ctx() { em, req }: MyContext
    ): Promise<User[] | null> {
        if(!req.session.userId) return null;
        return await em.find(User, {});
    }
}