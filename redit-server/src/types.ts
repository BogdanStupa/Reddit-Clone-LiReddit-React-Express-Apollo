import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import session from "express-session";

type IncludeSessionData<T> = T & {
    userId?: number | string;
};

export type MyContext = {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
    req: Express.Request & { session: IncludeSessionData<session.Session | session.InitializedSession> };
    res: Express.Response;
};
