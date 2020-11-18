import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from "express";
import { ErrorAuthCode } from "./error-codes-types/auth";

export type AuthType = {
    id: number;
    username: string;
};

export type AuthError = {
    code: ErrorAuthCode,
    message: string;
}

export type ReqType = Request & {
    authError?: AuthError,
    currentUser?: AuthType
}; 


export type MyContext = {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
    req: ReqType;
    res: Response;
};

export type JwtDataType = {
    id: number;
    username: string
}