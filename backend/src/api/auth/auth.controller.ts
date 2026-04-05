import { Request, Response, CookieOptions } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/AppError.js";

import { 
  login, 
  changePassword, 
  resetEmployeePassword, 
  getMe,
  switchBranch,
  getMyBranches
} from "../../services/auth.service.js";

import { cookieOptions } from "@/utils/cookie.js";




export const loginController = catchAsync(async (req: Request, res: Response) => {
  const { phoneNumber, password } = req.body;

  // Pass the third argument for metadata logging
  const { token, user } = await login(phoneNumber, password, {
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    status: "success",
    data: { user },
  });
});


export const logoutController = (req: Request, res: Response) => {
  res.clearCookie("token", cookieOptions);
  res.status(200).json({ 
    status: "success", 
    message: "Logged out successfully" 
  });
};


export const meController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);

  const user = await getMe(req.user.id);

  res.status(200).json({
    status: "success",
    data: { user },
  });
});


export const changePasswordController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);

  const { oldPassword, newPassword } = req.body;
  await changePassword(req.user.id, oldPassword, newPassword);

  res.status(200).json({ 
    status: "success", 
    message: "Password changed successfully" 
  });
});


export const resetEmployeePasswordController = catchAsync(async (req: Request, res: Response) => {
  const { employeeId } = req.body; 
  const organizationId = (req as any).user.organizationId; 
  
  const tempPassword = await resetEmployeePassword(employeeId, organizationId);

  res.status(200).json({
    status: "success",
    message: "Password reset successful",
    data: { tempPassword },
  });
});



export const switchBranchController = catchAsync(async (req: Request, res: Response) => {
  const { branchId } = req.body;
  const userId = req.user?.id;

  // 1. Data Integrity
  if (!userId) throw new AppError("Session expired, please login again", 401);
  if (!branchId) throw new AppError("Missing branch destination", 400);

  // 2. Execute Business Logic
  const { token, user } = await switchBranch(userId, Number(branchId));

  // 3. Cookie Management (Security Best Practices)
  const isProduction = process.env.NODE_ENV === "production";
  
  res.cookie("token", token, {
    httpOnly: true, // Prevents XSS attacks
    secure: isProduction, // Only send over HTTPS in prod
    sameSite: isProduction ? "none" : "lax", // Cross-site support if needed
    maxAge: 8 * 60 * 60 * 1000, // 8 Hours
    path: "/", // Available to all routes
  });

  // 4. Clean Response
  res.status(200).json({
    status: "success",
    message: `Switched context to ${user.name} @ Branch ${branchId}`,
    data: {
      user: {
        id: user.id,
        role: user.role,
        currentBranchId: branchId
      }
    }
  });
});


export const getMyBranchesController = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) throw new AppError("Unauthorized", 401);

  const branches = await getMyBranches(userId);

  res.status(200).json({
    status: "success",
    results: branches.length,
    data: { branches }
  });
});