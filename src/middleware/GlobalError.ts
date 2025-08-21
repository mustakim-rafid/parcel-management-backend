import { NextFunction, Request, Response } from "express";
import { getEnvs } from "../config/envconfig";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';


  let messageArray: string[] = []
  if (err?.name === "ZodError") {
    err?.issues.forEach((item: any) => {
      if (item.code === "invalid_enum_value") {
        item.message = `${item.message} - Expected: ${item.options.join(" or ")}`
      }
      if (item.received === "undefined") {
        item.message = `${item.path.join(", ")} required`
      }
      messageArray.push(item.message)
    })
    message = messageArray.join(". ")
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: {
        err,
        stack: getEnvs().NODE_ENV === 'development' ? err.stack : undefined
    }
  });
}