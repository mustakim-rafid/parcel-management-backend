import { getEnvs } from "../config/envconfig"
import { IUser } from "../modules/user/user.interface"
import jwt, { JwtPayload } from "jsonwebtoken"

export const generateToken = (payload: JwtPayload, secret: string, expiry: string) => {
    const token = jwt.sign(payload, secret, {
        expiresIn: expiry as jwt.SignOptions["expiresIn"]
    })

    return token
}

export const generateAccessAndRefreshToken = (payload: Partial<IUser>) => {
    const accessToken = generateToken(payload, getEnvs().ACCESS_TOKEN_SECRET, getEnvs().ACCESS_TOKEN_EXPIRY)
    const refreshToken = generateToken(payload, getEnvs().REFRESH_TOKEN_SECRET, getEnvs().REFRESH_TOKEN_EXPIRY)

    return {
        accessToken,
        refreshToken
    }
}