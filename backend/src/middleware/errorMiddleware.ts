import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;

  if (err.code === 'P2002') {
    const field = err.meta?.target;
    error = new AppError(`Duplicate field value: ${field}. Please use another value.`, 400);
  }

  
  if (err.code === 'P2025') {
    error = new AppError("Record not found.", 404);
  }

  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    status: statusCode < 500 ? 'fail' : 'error',
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};