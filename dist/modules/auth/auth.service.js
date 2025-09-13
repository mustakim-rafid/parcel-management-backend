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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../utils/AppError");
const user_model_1 = require("../user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../../utils/jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envconfig_1 = require("../../config/envconfig");
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isUserExists = yield user_model_1.User.findOne({ email });
    if (!isUserExists) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "No user found");
    }
    if (isUserExists.isBlocked) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "User is blocked");
    }
    if (!isUserExists.isVerified) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "User is not verified, verify first!");
    }
    const isPasswordCorrect = yield bcryptjs_1.default.compare(password, isUserExists.password);
    if (!isPasswordCorrect) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "Password is incorrect");
    }
    const { accessToken, refreshToken } = (0, jwt_1.generateAccessAndRefreshToken)({
        id: isUserExists._id,
        email: isUserExists.email,
        role: isUserExists.role
    });
    const _a = isUserExists.toObject(), { password: newPassword } = _a, rest = __rest(_a, ["password"]);
    return {
        accessToken,
        refreshToken,
        rest
    };
});
const refreshAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = jsonwebtoken_1.default.verify(refreshToken, (0, envconfig_1.getEnvs)().REFRESH_TOKEN_SECRET);
    if (!decodedToken) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "...");
    }
    const user = yield user_model_1.User.findOne({ email: decodedToken.email });
    if (!(user === null || user === void 0 ? void 0 : user.isVerified)) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "User is not verified");
    }
    if (user.isBlocked) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    const newAccessToken = (0, jwt_1.generateToken)({
        id: user._id,
        email: user.email,
        role: user.role
    }, (0, envconfig_1.getEnvs)().ACCESS_TOKEN_SECRET, (0, envconfig_1.getEnvs)().ACCESS_TOKEN_EXPIRY);
    return newAccessToken;
});
const resetPassword = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = payload;
    const isUserExist = yield user_model_1.User.findOne({
        email: decodedToken.email
    });
    if (!isUserExist) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    const isOldPasswordCorrect = yield bcryptjs_1.default.compare(oldPassword, isUserExist.password);
    if (!isOldPasswordCorrect) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Old password does not match");
    }
    isUserExist.password = newPassword;
    yield isUserExist.save();
});
exports.authServices = {
    login,
    refreshAccessToken,
    resetPassword
};
