import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/AppError";
import { User } from "../user/user.model";
import { IForgotPassword, ILogin } from "./auth.interface";
import bcryptjs from "bcryptjs"
import { generateAccessAndRefreshToken, generateToken } from "../../utils/jwt";
import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import { getEnvs } from "../../config/envconfig";

const login = async (payload: ILogin) => {
    const {email, password} = payload

    const isUserExists = await User.findOne({ email })

    if (!isUserExists) {
        throw new AppError(StatusCodes.NOT_FOUND, "No user found")
    }

    if (isUserExists.isBlocked) {
        throw new AppError(StatusCodes.NOT_FOUND, "User is blocked")
    }

    if (!isUserExists.isVerified) {
        throw new AppError(StatusCodes.NOT_FOUND, "User is not verified, verify first!")
    }

    const isPasswordCorrect = await bcryptjs.compare(password, isUserExists.password)

    if (!isPasswordCorrect) {
        throw new AppError(StatusCodes.NOT_ACCEPTABLE, "Password is incorrect")
    }

    const { accessToken, refreshToken } = generateAccessAndRefreshToken({
        id: isUserExists._id,
        email: isUserExists.email,
        role: isUserExists.role
    })

    const { password: newPassword, ...rest } = isUserExists.toObject()

    return {
        accessToken,
        refreshToken,
        rest
    }
}

const refreshAccessToken = async (refreshToken: string) => {
    const decodedToken = jwt.verify(refreshToken, getEnvs().REFRESH_TOKEN_SECRET)

    if (!decodedToken) {
        throw new AppError(StatusCodes.NOT_ACCEPTABLE, "...")
    }

    const user = await User.findOne({ email: (decodedToken as JwtPayload).email })

    if (!user?.isVerified) {
        throw new AppError(StatusCodes.NOT_ACCEPTABLE, "User is not verified")
    }
    if (user.isBlocked) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found")
    }

    const newAccessToken = generateToken({
        id: user._id,
        email: user.email,
        role: user.role
    }, getEnvs().ACCESS_TOKEN_SECRET, getEnvs().ACCESS_TOKEN_EXPIRY)

    return newAccessToken
}

const resetPassword = async (payload: IForgotPassword, decodedToken: JwtPayload) => {
    const { oldPassword, newPassword } = payload
    
    const isUserExist = await User.findOne({
        email: decodedToken.email
    })

    if (!isUserExist) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found")
    }

    const isOldPasswordCorrect = await bcryptjs.compare(oldPassword, isUserExist.password as string)

    if (!isOldPasswordCorrect) {
        throw new AppError(StatusCodes.NOT_FOUND, "Old password does not match")
    }

    isUserExist.password = newPassword

    await isUserExist.save()
}

export const authServices = {
    login,
    refreshAccessToken,
    resetPassword
}