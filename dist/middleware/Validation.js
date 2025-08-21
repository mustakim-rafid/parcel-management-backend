"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = void 0;
const validation = (zodSchema) => (req, res, next) => {
    try {
        req.body = zodSchema.parse(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validation = validation;
