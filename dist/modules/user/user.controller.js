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
exports.userControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const user_service_1 = require("./user.service");
const ApiResponse_1 = require("../../utils/ApiResponse");
const http_status_codes_1 = require("http-status-codes");
const register = (0, catchAsync_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userServices.register(req.body);
    (0, ApiResponse_1.ApiResponse)(res, http_status_codes_1.StatusCodes.CREATED, "User registered successfully!", user);
}));
const getUser = (0, catchAsync_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userServices.getUser(req.user);
    (0, ApiResponse_1.ApiResponse)(res, http_status_codes_1.StatusCodes.OK, "User retrieved successfully!", user);
}));
const getAllUsers = (0, catchAsync_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_service_1.userServices.getAllUsers();
    (0, ApiResponse_1.ApiResponse)(res, http_status_codes_1.StatusCodes.OK, "Users retrieved successfully", users);
}));
const updateUser = (0, catchAsync_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUpdatedUser = yield user_service_1.userServices.updateUser(req.params.id, req.body, req.user);
    (0, ApiResponse_1.ApiResponse)(res, http_status_codes_1.StatusCodes.OK, "User updated successfully", newUpdatedUser);
}));
const getReceiverByEmail = (0, catchAsync_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.query.email;
    const receiver = yield user_service_1.userServices.getReceiverByEmail(email);
    (0, ApiResponse_1.ApiResponse)(res, http_status_codes_1.StatusCodes.OK, "Receiver retrieved successfully!", receiver);
}));
exports.userControllers = {
    register,
    getUser,
    getAllUsers,
    updateUser,
    getReceiverByEmail
};
