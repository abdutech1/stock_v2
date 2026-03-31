import { CookieOptions } from "express";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  // 'none' requires 'secure: true', which is why we check NODE_ENV
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 8 * 60 * 60 * 1000, // 8 hours
};