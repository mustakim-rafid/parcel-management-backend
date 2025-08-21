"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvs = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const AppError_1 = require("../utils/AppError");
const http_status_codes_1 = require("http-status-codes");
dotenv_1.default.config({
    path: "./.env"
});
const envNames = ["MONGO_URI", "NODE_ENV", "PORT", "ACCESS_TOKEN_SECRET", "ACCESS_TOKEN_EXPIRY", "REFRESH_TOKEN_SECRET", "REFRESH_TOKEN_EXPIRY", "ADMIN_EMAIL", "ADMIN_PASSWORD"];
const getEnvs = () => {
    for (const item of envNames) {
        const value = process.env[item];
        if (!value) {
            throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, `${value} ENV missing`);
        }
    }
    return {
        MONGO_URI: process.env.MONGO_URI,
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
        ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
        REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
    };
};
exports.getEnvs = getEnvs;
