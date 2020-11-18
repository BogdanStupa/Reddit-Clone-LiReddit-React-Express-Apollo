import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { __prod__ } from "./constants";
import { MyContext } from "./types";
import cors from "cors";
import { isAuth } from "./middlewares/is-auth";
import  * as dotenv from "dotenv";

dotenv.config();

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();

    app.use(cors({
        credentials: true,
        origin: "http://localhost:3000"
    }));
    
    app.use(isAuth);

    app.set('trust proxy', 1);

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserResolver],
            validate: false
        }),
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res})
    }); 

    apolloServer.applyMiddleware({ 
        app, 
        cors: false
    });

    app.listen(4000, () => {
        console.log(`server started on localhost:4000`);    
    });
}
main().catch(error => {
    console.log(error); 
});
