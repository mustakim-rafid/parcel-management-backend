import dotenv from "dotenv"
import { AppError } from "../utils/AppError";
import { StatusCodes } from "http-status-codes";

dotenv.config({
    path: "./.env"
})

interface IEnv {
    MONGO_URI: string;
    NODE_ENV: "production" | "development";
    ACCESS_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRY: string;
    REFRESH_TOKEN_SECRET: string;
    REFRESH_TOKEN_EXPIRY: string;
    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string;
}
const envNames = ["MONGO_URI", "NODE_ENV", "ACCESS_TOKEN_SECRET", "ACCESS_TOKEN_EXPIRY", "REFRESH_TOKEN_SECRET", "REFRESH_TOKEN_EXPIRY", "ADMIN_EMAIL", "ADMIN_PASSWORD"];

export const getEnvs = (): IEnv => {
    for (const item of envNames) {
        const value = process.env[item]
        if (!value) {
            throw new AppError(StatusCodes.NOT_FOUND, `${value} ENV missing`)
        }
    }

    return {
        MONGO_URI: process.env.MONGO_URI as string,
        NODE_ENV: process.env.NODE_ENV as "production" | "development",
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
        ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as string,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
        REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as string,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string
    };
}