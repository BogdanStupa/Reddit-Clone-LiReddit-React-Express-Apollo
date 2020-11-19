import "reflect-metadata";
import { createConnection } from "typeorm";
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
import { User } from "./entities/User";
import { Post } from "./entities/Post";

dotenv.config();

const main = async () => {
    await createConnection({
        type: "postgres",
        database: "lireddit",
        username:"postgres",
        password: "new_password",
        logging: true,
        synchronize: true,
        entities: [User, Post],
    });

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
        context: ({ req, res }): MyContext => ({ req, res})
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
