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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const AppError_1 = require("../utils/AppError");
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envconfig_1 = require("../config/envconfig");
const user_model_1 = require("../modules/user/user.model");
const checkAuth = (roles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization || req.cookies.accessToken;
        if (!token) {
            throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Access Token missing.");
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, (0, envconfig_1.getEnvs)().ACCESS_TOKEN_SECRET);
        const user = yield user_model_1.User.findOne({ email: decodedToken.email });
        if (!roles.includes(user === null || user === void 0 ? void 0 : user.role)) {
            throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "Unauthorized request");
        }
        if (!(user === null || user === void 0 ? void 0 : user.isVerified)) {
            throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "User is not verified");
        }
        if (user.isBlocked) {
            throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        }
        req.user = decodedToken;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.checkAuth = checkAuth;
