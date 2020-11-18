import { UsernamePasswordInput, UserResponse } from "../resolvers/resolver-types/user"


export function authValidation(options: UsernamePasswordInput): UserResponse | null {
    if (options.username.length < 5 || options.username.length > 12) {
        return {
            errors: [{
                field: "username",
                message: "length must be between 5 and 12"
            }]
        }
    }
    if (options.password.length < 5 || options.password.length > 12) {
        return {
            errors: [{
                field: "password",
                message: "length must be between 5 and 12"
            }]
        }
    }
    return null
}