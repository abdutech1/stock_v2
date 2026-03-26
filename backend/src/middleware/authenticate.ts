import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

const JWT_SECRET = process.env.JWT_SECRET!;

interface JwtPayload {
  id: number;
  role: any;
  organizationId: number;
  branchId?: number;
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new AppError("Unauthorized: No token provided", 401));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.user = {
      id: decoded.id,
      role: decoded.role,
      organizationId: decoded.organizationId,
      branchId: decoded.branchId || Number(req.headers["x-branch-id"]), 
    };

    next();
  } catch (error) {
    next(new AppError("Unauthorized: Invalid or expired token", 401));
  }
}