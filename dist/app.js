"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./routes/router"));
const GlobalError_1 = require("./middleware/GlobalError");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Parcel Management System"
    });
});
app.use("/api/v1", router_1.default);
app.use(GlobalError_1.globalErrorHandler);
