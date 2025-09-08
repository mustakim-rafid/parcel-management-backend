"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReceiverZodSchema = exports.userUpdateZodSchema = exports.userCreateZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
const userAddressZodSchema = zod_1.default.object({
    street: zod_1.default.string({ message: "Street inside address is required" }),
    city: zod_1.default.string({ message: "City inside address is required" }),
    state: zod_1.default.string({ message: "State inside address is required" }),
    zip: zod_1.default.string({ message: "Zip inside address is required" }),
    country: zod_1.default.string({ message: `Country inside address is required` })
}, {
    message: "Address is required"
});
exports.userCreateZodSchema = zod_1.default.object({
    name: zod_1.default.string({ invalid_type_error: "Name must be a string", message: "Name is required" }),
    email: zod_1.default.string({ invalid_type_error: "Email must be a string", message: "Email is required" }).email("Invalid email").min(3, "Email too short"),
    password: zod_1.default.string({ message: "Password is required" }).min(6, "Password length must be at least 6").regex(/(?=.*[A-Z])/, "Password must have at least one uppercase letter").regex(/(?=.*\d)/, "Password must have at least one digit").regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, "Password must have at least one special character"),
    phone: zod_1.default.string({ message: "Phone is required" }).length(11, "Phone number must be Bangladeshi valid number"),
    role: zod_1.default.enum([user_interface_1.Role.RECEIVER, user_interface_1.Role.SENDER], { message: "Not a valid role" }),
    address: userAddressZodSchema
});
exports.userUpdateZodSchema = zod_1.default.object({
    name: zod_1.default.string({ invalid_type_error: "Name must be a string" }).optional(),
    email: zod_1.default.string({ invalid_type_error: "Email must be a string" }).email("Invalid email").min(3, "Email too short").optional(),
    password: zod_1.default.string().min(6, "Password length must be at least 6").regex(/(?=.*[A-Z])/, "Password must have at least one uppercase letter").regex(/(?=.*\d)/, "Password must have at least one digit").regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, "Password must have at least one special character").optional(),
    phone: zod_1.default.string().regex(/^\+880\d{10}$/, "Phone number must be Bangladeshi valid number").optional(),
    role: zod_1.default.enum([user_interface_1.Role.ADMIN, user_interface_1.Role.RECEIVER, user_interface_1.Role.SENDER], { message: "Not a valid role" }).optional(),
    isVerified: zod_1.default.boolean().optional(),
    isBlocked: zod_1.default.boolean().optional(),
    address: userAddressZodSchema.optional()
});
exports.getReceiverZodSchema = zod_1.default.object({
    email: zod_1.default.string({ invalid_type_error: "Email must be a string" }).email("Invalid email").min(3, "Email too short"),
});
