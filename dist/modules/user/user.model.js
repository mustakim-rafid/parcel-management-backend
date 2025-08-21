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
exports.User = exports.addressSchema = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.addressSchema = new mongoose_1.Schema({
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
}, {
    versionKey: false,
    _id: false
});
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        required: true
    },
    isVerified: {
        type: Boolean,
        default: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: exports.addressSchema,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.password = yield bcryptjs_1.default.hash(this.password, 10);
        next();
    });
});
exports.User = (0, mongoose_1.model)("User", userSchema);
