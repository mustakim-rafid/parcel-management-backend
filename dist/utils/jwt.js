"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessAndRefreshToken = exports.generateToken = void 0;
const envconfig_1 = require("../config/envconfig");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (payload, secret, expiry) => {
    const token = jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: expiry
    });
    return token;
};
exports.generateToken = generateToken;
const generateAccessAndRefreshToken = (payload) => {
    const accessToken = (0, exports.generateToken)(payload, (0, envconfig_1.getEnvs)().ACCESS_TOKEN_SECRET, (0, envconfig_1.getEnvs)().ACCESS_TOKEN_EXPIRY);
    const refreshToken = (0, exports.generateToken)(payload, (0, envconfig_1.getEnvs)().REFRESH_TOKEN_SECRET, (0, envconfig_1.getEnvs)().REFRESH_TOKEN_EXPIRY);
    return {
        accessToken,
        refreshToken
    };
};
exports.generateAccessAndRefreshToken = generateAccessAndRefreshToken;
