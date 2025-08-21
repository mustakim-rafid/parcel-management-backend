"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
const ApiResponse = (res, statusCode, message, data, meta) => {
    res.status(statusCode).json({
        statusCode,
        message,
        data,
        meta
    });
};
exports.ApiResponse = ApiResponse;
