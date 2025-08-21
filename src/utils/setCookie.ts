import { Response } from "express";
import { getEnvs } from "../config/envconfig";

export const setCookies = (res: Response, accessToken: string, refreshToken: string) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: getEnvs().NODE_ENV === "production",
        sameSite: "none"
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: getEnvs().NODE_ENV === "production",
        sameSite: "none"
    })
}