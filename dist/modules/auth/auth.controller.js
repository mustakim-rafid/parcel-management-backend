"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const auth_service_1 = require("./auth.service");
const ApiResponse_1 = require("../../utils/ApiResponse");
const http_status_codes_1 = require("http-status-codes");
const setCookie_1 = require("../../utils/setCookie");
const envconfig_1 = require("../../config/envconfig");
const login = (0, catchAsync_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield auth_service_1.authServices.login(req.body);
    (0, setCookie_1.setCookies)(res, data.accessToken, data.refreshToken);
    (0, ApiResponse_1.ApiResponse)(res, http_status_codes_1.StatusCodes.ACCEPTED, "User logged in successfully", data);
}));
const refreshAccessToken = (0, catchAsync_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = yield auth_service_1.authServices.refreshAccessToken(refreshToken);
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: (0, envconfig_1.getEnvs)().NODE_ENV === "production",
        sameSite: "none"
    });
    (0, ApiResponse_1.ApiResponse)(res, http_status_codes_1.StatusCodes.OK, "Access token refreshed successfully", { accessToken });
}));
const logout = (0, catchAsync_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: (0, envconfig_1.getEnvs)().NODE_ENV === "production",
        sameSite: "none"
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: (0, envconfig_1.getEnvs)().NODE_ENV === "production",
        sameSite: "none"
    });
    (0, ApiResponse_1.ApiResponse)(res, http_status_codes_1.StatusCodes.OK, "User logged out successfully", {});
}));
const resetPassword = (0, catchAsync_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.body;
    yield auth_service_1.authServices.resetPassword({ oldPassword, newPassword }, req.user);
    (0, ApiResponse_1.ApiResponse)(res, http_status_codes_1.StatusCodes.OK, "Password changed successfully", {});
}));
exports.authControllers = {
    login,
    logout,
    refreshAccessToken,
    resetPassword
};
