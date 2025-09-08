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
exports.userServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../utils/AppError");
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const register = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findOne({
        email: payload.email
    });
    if (isUserExists) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.FORBIDDEN, "User already exists with this email");
    }
    const newUser = yield user_model_1.User.create(payload);
    const _a = newUser.toObject(), { password, isVerified, isBlocked } = _a, data = __rest(_a, ["password", "isVerified", "isBlocked"]);
    return data;
});
const getUser = (userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userInfo.id);
    if (!user) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    const _a = user.toObject(), { password, isVerified, isBlocked } = _a, data = __rest(_a, ["password", "isVerified", "isBlocked"]);
    return data;
});
const getReceiverByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const receiver = yield user_model_1.User.findOne({
        email,
        role: user_interface_1.Role.RECEIVER
    });
    if (!receiver) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "No receiver found");
    }
    const _a = receiver.toObject(), { password, isVerified, isBlocked } = _a, data = __rest(_a, ["password", "isVerified", "isBlocked"]);
    return data;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find({}, { password: 0 });
    return users;
});
const updateUser = (id, payload, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    if (payload.isVerified || payload.isBlocked) {
        if (userInfo.role !== user_interface_1.Role.ADMIN) {
            throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "You cann't change verify and block field");
        }
    }
    if (payload.role) {
        if (userInfo.role === user_interface_1.Role.RECEIVER || userInfo.role === user_interface_1.Role.SENDER) {
            throw new AppError_1.AppError(http_status_codes_1.StatusCodes.FORBIDDEN, "Sorry you can't update role field");
        }
    }
    if (userInfo.id !== id) {
        if (userInfo.role === user_interface_1.Role.SENDER || userInfo.role === user_interface_1.Role.RECEIVER) {
            throw new AppError_1.AppError(http_status_codes_1.StatusCodes.FORBIDDEN, "Unauthorized request");
        }
    }
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, 10);
    }
    const newUpdatedUser = yield user_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
    });
    const _a = newUpdatedUser.toObject(), { password, isVerified, isBlocked } = _a, data = __rest(_a, ["password", "isVerified", "isBlocked"]);
    return data;
});
exports.userServices = {
    register,
    getUser,
    getAllUsers,
    updateUser,
    getReceiverByEmail
};
