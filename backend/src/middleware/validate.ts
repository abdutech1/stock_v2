import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function validate<T extends z.ZodType<any, any, any>>(
  schema: T, 
  source: 'body' | 'query' | 'params' = 'body' 
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[source]);
      
      Object.assign(req[source], parsed); 
      
      next();
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err.errors ?? err.issues ?? [{ message: err.message }],
      });
    }
  };
}