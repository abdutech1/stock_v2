import { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client"; // This now has SUPER_ADMIN
import { AppError } from "../utils/AppError.js";

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // 1. Check if user exists (set by authenticate middleware)
    const user = req.user;
    if (!user) {
      return next(new AppError("Authentication required", 401));
    }

    // 2. SUPER_ADMIN bypasses all checks
    if (user.role === UserRole.SUPER_ADMIN) return next();

    // 3. Check if the user's role is in the allowed list
    if (!allowedRoles.includes(user.role)) {
      return next(new AppError("Forbidden: Insufficient permissions", 403));
    }

    next();
  };
}