import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;



export function authenticate(req: Request, res: Response, next: NextFunction) {
  console.log("--- Auth Check ---");
  console.log("All Cookies:", req.cookies); 
  console.log("Token Found:", !!req.cookies?.token);
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized: No token",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      role: "OWNER" | "EMPLOYEE";
    };

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch {
    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token",
    });
  }
}
