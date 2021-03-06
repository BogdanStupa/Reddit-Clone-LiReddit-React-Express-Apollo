import { Post } from "../entities/Post";
import { MyContext } from "src/types";
import { Resolver, Query, Ctx, Arg, Mutation } from "type-graphql";
import { handleAuthErrors } from "../utils/error-handing";


@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts( @Ctx() { req }: MyContext ): Promise<Post[]>{
        if(req.authError) handleAuthErrors(req.authError);
        return Post.find();
    }

    @Query(() => Post, { nullable: true })
    post(
        @Arg("id") id: number): Promise<Post | undefined>{
        return Post.findOne(id);
    }

    @Mutation(() => Post)
    async createPost(@Arg("title")  title: string): Promise<Post>{
        return Post.create({ title }).save();  
    }

    @Mutation(() => Post, { nullable: true })
    async updatePost(
        @Arg("id") id: number, 
        @Arg("title", { nullable: true })  title: string
    ): Promise<Post | null>{
        const post = await Post.findOne(id);
        
        if(!post) return null;

        if(typeof title !== "undefined"){
            await Post.update({ id }, { title });
        }

        return post;
    }

    @Mutation(() => Boolean)
    async deletePost( @Arg("id") id: number): Promise<boolean>{
        await Post.delete(id);
        return true;
    }
}