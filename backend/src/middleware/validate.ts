import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export const validate = (schema: z.ZodTypeAny) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Parse the request
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // 2. Type Assertion: Tell TS that 'parsed' has these optional keys
      const validated = parsed as {
        body?: any;
        query?: any;
        params?: any;
      };

      // 3. Conditional Overwrite
      if (validated.body !== undefined) req.body = validated.body;
      if (validated.query !== undefined) req.query = validated.query;
      if (validated.params !== undefined) req.params = validated.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });
      }
      next(error);
    }
  };