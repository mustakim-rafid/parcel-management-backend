import { NextFunction, Request, Response } from "express";

type FunctionType = (req: Request, res: Response, next: NextFunction) => Promise<any>

export const asyncHandler = (fn: FunctionType) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        console.log("Someting went wrong")
        next(err)
    })
}