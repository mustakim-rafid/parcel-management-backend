"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookies = void 0;
const envconfig_1 = require("../config/envconfig");
const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: (0, envconfig_1.getEnvs)().NODE_ENV === "production",
        sameSite: "none"
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: (0, envconfig_1.getEnvs)().NODE_ENV === "production",
        sameSite: "none"
    });
};
exports.setCookies = setCookies;
