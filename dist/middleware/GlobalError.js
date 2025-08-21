"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const envconfig_1 = require("../config/envconfig");
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let messageArray = [];
    if ((err === null || err === void 0 ? void 0 : err.name) === "ZodError") {
        err === null || err === void 0 ? void 0 : err.issues.forEach((item) => {
            if (item.code === "invalid_enum_value") {
                item.message = `${item.message} - Expected: ${item.options.join(" or ")}`;
            }
            if (item.received === "undefined") {
                item.message = `${item.path.join(", ")} required`;
            }
            messageArray.push(item.message);
        });
        message = messageArray.join(". ");
    }
    res.status(statusCode).json({
        success: false,
        message,
        error: {
            err,
            stack: (0, envconfig_1.getEnvs)().NODE_ENV === 'development' ? err.stack : undefined
        }
    });
};
exports.globalErrorHandler = globalErrorHandler;
