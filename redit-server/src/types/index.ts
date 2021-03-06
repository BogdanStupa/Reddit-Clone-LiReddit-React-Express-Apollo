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
    req: ReqType;
    res: Response;
};

export type JwtDataType = {
    id: number;
    username: string
}