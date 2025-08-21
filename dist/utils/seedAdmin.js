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
exports.createAdmin = void 0;
const envconfig_1 = require("../config/envconfig");
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const createAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isAdminExists = yield user_model_1.User.findOne({
            email: (0, envconfig_1.getEnvs)().ADMIN_EMAIL
        });
        if (isAdminExists) {
            console.log("Admin account already created");
            return;
        }
        const adminUserObject = {
            name: "Admin",
            email: (0, envconfig_1.getEnvs)().ADMIN_EMAIL,
            password: (0, envconfig_1.getEnvs)().ADMIN_PASSWORD,
            phone: "+880133333333",
            role: user_interface_1.Role.ADMIN,
            address: {
                state: "CKB",
                street: "2no. road",
                zip: "0000",
                city: "CTG",
                country: "BD"
            }
        };
        const adminUser = yield user_model_1.User.create(adminUserObject);
        console.log("Admin created successfully");
    }
    catch (error) {
        console.log("Something went wrong while creating the ADMIN user.", error);
    }
});
exports.createAdmin = createAdmin;
