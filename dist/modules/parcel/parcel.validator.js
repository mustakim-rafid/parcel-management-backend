"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parcelStatusUpdateZodSchema = exports.parcelUpdateZodSchema = exports.parcelCreateZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const parcel_interface_1 = require("./parcel.interface");
exports.parcelCreateZodSchema = zod_1.default.object({
    type: zod_1.default.string(),
    weight: zod_1.default.string(),
    fee: zod_1.default.number(),
    status: zod_1.default.nativeEnum(parcel_interface_1.Status, { message: "Invalid status" }).optional(),
    deliveryDate: zod_1.default.string().transform(val => new Date(val)),
    sender: zod_1.default.string().length(24, { message: "Sender's id must be a 24 characters string" }),
    receiver: zod_1.default.string().length(24, { message: "Receiver's id must be a 24 characters string" }),
});
exports.parcelUpdateZodSchema = zod_1.default.object({
    type: zod_1.default.string().optional(),
    weight: zod_1.default.string().optional(),
    fee: zod_1.default.number().optional(),
    status: zod_1.default.nativeEnum(parcel_interface_1.Status, { message: "Invalid status" }).optional(),
    deliveryDate: zod_1.default.string().transform(val => new Date(val)).optional(),
    receiver: zod_1.default.string().optional()
});
exports.parcelStatusUpdateZodSchema = zod_1.default.object({
    location: zod_1.default.string(),
    timestamp: zod_1.default.string().transform(val => new Date(val)).optional(),
    status: zod_1.default.nativeEnum(parcel_interface_1.Status, { message: "Invalid status" }),
    note: zod_1.default.string()
});
