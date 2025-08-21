"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordZodSchema = exports.userLoginZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.userLoginZodSchema = zod_1.default.object({
    email: zod_1.default.string({ invalid_type_error: "Email must be a string" }).email("Invalid email").min(3, "Email too short"),
    password: zod_1.default.string().min(6, "Password length must be at least 6").regex(/(?=.*[A-Z])/, "Password must have at least one uppercase letter").regex(/(?=.*\d)/, "Password must have at least one digit").regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, "Password must have at least one special character"),
});
exports.resetPasswordZodSchema = zod_1.default.object({
    oldPassword: zod_1.default.string(),
    newPassword: zod_1.default.string().min(6, "Password length must be at least 6").regex(/(?=.*[A-Z])/, "Password must have at least one uppercase letter").regex(/(?=.*\d)/, "Password must have at least one digit").regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, "Password must have at least one special character")
});
