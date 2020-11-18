import JWT from "jsonwebtoken";
import { JwtDataType } from "../types";

export const createAccessJwtToken = (data: JwtDataType):string => JWT.sign(data, process.env.SECRET_ACCESS_TOKEN_KEY!,{ algorithm: "HS256", expiresIn: "5min" });

export const createRefreshJwtToken = (data: JwtDataType):string => JWT.sign(data, process.env.SECRET_REFRESH_TOKEN_KEY!, { algorithm: "HS256" });
