import { Field, InputType, ObjectType } from "type-graphql";


@ObjectType()
export class LoginUserResponse{
    @Field()
    username: string;

    @Field()
    id: number;
}

@InputType()
export class UsernamePasswordInput {
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
export class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => LoginUserResponse, { nullable: true })
    user?: LoginUserResponse;
}

@InputType()
export class RefreshAccessTokenRequest {
    @Field()
    refreshToken: string;

    @Field()
    userId: number
}

@ObjectType()
export class RefreshAccessTokenResponse {
    @Field({ nullable: true })
    newAccessToken: string;
}