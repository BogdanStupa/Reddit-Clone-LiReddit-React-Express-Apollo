export interface IUserData {
    id: number;
    username: string;
}
export interface IUserDataResponse {
    userData: IUserData
}

export interface IAuthData {
    id: number;
    refreshToken: string;
    auth: boolean;
};

export interface IAuthDataResponse {
    isAuth: IAuthData
}