import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/catchAsync";
import { ZodSchema } from "zod";

export const validation = (zodSchema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body = zodSchema.parse(req.body)
        next()
    } catch (error) {
        next(error)
    }
}