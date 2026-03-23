import { Request, Response, CookieOptions } from "express";
import {
  registerOwner,
  login,
  changePassword,
  resetEmployeePassword,
   getMe
} from "../../services/auth.service.js";

export async function registerOwnerController(
  req: Request,
  res: Response
) {
  try {
    const owner = await registerOwner(req.body);
    res.status(201).json(owner);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}


// const cookieOptions = {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === "production",
//   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//   maxAge: 8 * 60 * 60 * 1000,
// } as const; 

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: false, // Must be false for http://192.168...
  sameSite: "lax", // 'lax' is best for local IP testing
  path: "/",
  maxAge: 8 * 60 * 60 * 1000,
};



export async function loginController(req: Request, res: Response) {
  try {
    const { phoneNumber, password } = req.body;

    const { token, user } = await login(phoneNumber, password, {
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: err.message || "Login failed",
    });
  }
}


export function logoutController(_: Request, res: Response) {
  res.clearCookie("token", cookieOptions);

  res.json({ success: true, message: "Logged out successfully" });
}



export async function changePasswordController(
  req: Request,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { oldPassword, newPassword } = req.body;

    await changePassword(req.user.id, oldPassword, newPassword);

    res.json({ message: "Password changed successfully" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}


export async function resetEmployeePasswordController(
  req: Request,
  res: Response
) {
  try {
    const { employeeId } = req.body; 
    
    const tempPassword = await resetEmployeePassword(employeeId);

    res.json({
      message: "Password reset successful",
      tempPassword,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}




export async function meController(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await getMe(req.user.id);

    res.json({
      success: true,
      user,
    });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
}
