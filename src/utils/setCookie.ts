import { Response } from "express";
import { getEnvs } from "../config/envconfig";

export const setCookies = (res: Response, accessToken: string, refreshToken: string) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
}