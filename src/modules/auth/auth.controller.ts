import { Request, Response } from "express";
import { asyncHandler } from "../../utils/catchAsync";
import { authServices } from "./auth.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { StatusCodes } from "http-status-codes";
import { setCookies } from "../../utils/setCookie";
import { getEnvs } from "../../config/envconfig";

const login = asyncHandler(async (req: Request, res: Response) => {
    const data = await authServices.login(req.body)
    setCookies(res, data.accessToken, data.refreshToken)
    ApiResponse(res, StatusCodes.ACCEPTED, "User logged in successfully", data)
})

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const accessToken = await authServices.refreshAccessToken(refreshToken)
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: getEnvs().NODE_ENV === "production",
        sameSite: "none"
    })
    ApiResponse(res, StatusCodes.OK, "Access token refreshed successfully", {accessToken})
})

const logout = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
    ApiResponse(res, StatusCodes.OK, "User logged out successfully", {})
})

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body

    await authServices.resetPassword({oldPassword, newPassword}, req.user)

    ApiResponse(res, StatusCodes.OK, "Password changed successfully", {})
})

export const authControllers = {
    login,
    logout,
    refreshAccessToken,
    resetPassword
}