import { Response } from "express"

export const ApiResponse = (res: Response, statusCode: number, message: string, data: any, meta?: any) => {
    res.status(statusCode).json({
        statusCode,
        message,
        data,
        meta
    })
}