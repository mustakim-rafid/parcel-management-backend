import { NextFunction, Request, Response } from "express";
import { Role } from "../modules/user/user.interface";
import { AppError } from "../utils/AppError";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken"
import { getEnvs } from "../config/envconfig";
import { User } from "../modules/user/user.model";

export const checkAuth = (roles: Role[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization || req.cookies.accessToken
    
        if (!token) {
            throw new AppError(StatusCodes.NOT_FOUND, "Access Token missing.")
        }
    
        const decodedToken = jwt.verify(token, getEnvs().ACCESS_TOKEN_SECRET)

        const user = await User.findOne({ email: (decodedToken as JwtPayload).email })

        if (!roles.includes(user?.role!)) {
            throw new AppError(StatusCodes.NOT_ACCEPTABLE, "Unauthorized request")
        }
        if (!user?.isVerified) {
            throw new AppError(StatusCodes.NOT_ACCEPTABLE, "User is not verified")
        }
        if (user.isBlocked) {
            throw new AppError(StatusCodes.NOT_FOUND, "User is blocked")
        }

        req.user = decodedToken as JwtPayload

        next()
    } catch (error) {
        next(error)
    }
}