import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";
import { AppError } from "../utils/AppError.js";
import { UserRole } from "@prisma/client";


const JWT_SECRET = process.env.JWT_SECRET!;
// const JWT_EXPIRES_IN = "8h";

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";


export async function login(
  phoneNumber: string,
  password: string,
  meta?: { ip?: string; userAgent?: string } 
) {
  const user = await prisma.user.findUnique({
    where: { phoneNumber },
    include: { branches: { select: { branchId: true } } }
  });

  if (!user || !user.isActive) {
    throw new AppError("Invalid credentials or inactive account", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid credentials", 401);

  const activeBranchId = user.branches[0]?.branchId;

  const token = jwt.sign(
    { 
      id: user.id, 
      role: user.role, 
      organizationId: user.organizationId, 
      branchId: activeBranchId 
    },
    process.env.JWT_SECRET!,
    { expiresIn: JWT_EXPIRES_IN as any }
  );

  // Bring back the housekeeping - it's essential for industry standards
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    }),
    prisma.loginLog.create({
      data: {
        userId: user.id,
        ip: meta?.ip,
        userAgent: meta?.userAgent,
      },
    }),
  ]);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
      organizationId: user.organizationId,
      branchId: activeBranchId
    }
  };
}



export async function changePassword(userId: number, oldPass: string, newPass: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found", 404);

  const isMatch = await bcrypt.compare(oldPass, user.password);
  if (!isMatch) throw new AppError("Current password incorrect", 400);

  const hashed = await bcrypt.hash(newPass, 10);

  return await prisma.user.update({
    where: { id: userId },
    data: { 
      password: hashed, 
      mustChangePassword: false // Flag is cleared here
    }
  });
}

export async function getMe(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      phoneNumber: true,
      role: true,
      organizationId: true,
      isActive: true,
      mustChangePassword: true,
      organization: {
        select: { name: true, slug: true, plan: true }
      },
      branches: {
        select: {
          branch: { select: { id: true, name: true } }
        }
      }
    },
  });

  if (!user) throw new AppError("User not found", 404);

  return user;
}



export async function switchBranch(userId: number, targetBranchId: number) {
  // 1. Fetch User and Target Branch in parallel for performance
  const [user, targetBranch] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, organizationId: true, name: true }
    }),
    prisma.branch.findUnique({
      where: { id: targetBranchId },
      select: { id: true, organizationId: true, isActive: true }
    })
  ]);

  // 2. Fundamental Checks
  if (!user) throw new AppError("User profile not found", 404);
  if (!targetBranch) throw new AppError("Target branch does not exist", 404);
  if (!targetBranch.isActive) throw new AppError("Target branch is currently inactive", 400);

  // 3. Permission Hierarchy (The "Industry Standard" Check)
  let canAccess = false;

  // Tier A: Super Admin (Global Access)
  if (user.role === UserRole.SUPER_ADMIN) {
    canAccess = true;
  } 
  // Tier B: Org Admin (Access all branches within THEIR organization)
  else if (user.role === UserRole.ORG_ADMIN) {
    if (user.organizationId === targetBranch.organizationId) {
      canAccess = true;
    }
  } 
  // Tier C: Employee (Must have an explicit link in BranchUser)
  else {
    const branchLink = await prisma.branchUser.findUnique({
      where: { 
        userId_branchId: { userId, branchId: targetBranchId } 
      }
    });
    if (branchLink) canAccess = true;
  }

  if (!canAccess) {
    throw new AppError("Access Denied: You do not have permissions for this branch.", 403);
  }

  // 4. Generate a Context-Aware JWT
  const tokenPayload = {
    id: user.id,
    role: user.role,
    organizationId: user.organizationId,
    branchId: targetBranchId, // The "Current Context"
  };

  const newToken = jwt.sign(
    tokenPayload,
    process.env.JWT_SECRET!,
    { expiresIn: JWT_EXPIRES_IN as any }
  );

  return { 
    token: newToken, 
    user: { ...user, branchId: targetBranchId } 
  };
}



export async function resetEmployeePassword(employeeId: number, organizationId: number) {
  const user = await prisma.user.findFirst({
    where: { id: employeeId, organizationId },
  });

  if (!user) throw new AppError("Employee not found", 404);

  const tempPassword = `Temp@${Math.floor(100000 + Math.random() * 900000)}`;
  const hashed = await bcrypt.hash(tempPassword, 10);

  await prisma.user.update({
    where: { id: employeeId },
    data: {
      password: hashed,
      mustChangePassword: true,
    },
  });

  return tempPassword;
}



export async function getMyBranches(userId: number) {
  // 1. Get the user's role and organizationId
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      role: true, 
      organizationId: true 
    }
  });

  if (!user) throw new AppError("User not found", 404);

  // 2. LOGIC FOR ORG_ADMIN: Fetch all active branches in their org
  if (user.role === "ORG_ADMIN" || user.role === "SUPER_ADMIN") {
    const branches = await prisma.branch.findMany({
      where: {
        organizationId: user.organizationId,
        isActive: true,
        deletedAt: null // Excludes the deleted branches (7, 8, 9)
      },
      select: {
        id: true,
        name: true,
      }
    });

    return branches.map(b => ({
      id: b.id,
      name: b.name,
      userBranchRole: user.role // Admin has admin role across all
    }));
  }

  // 3. LOGIC FOR EMPLOYEES: Only fetch assigned branches from branchuser table
  const assignedBranches = await prisma.branchUser.findMany({
    where: { 
      userId: userId,
      branch: {
        isActive: true,
        deletedAt: null
      }
    },
    select: {
      branch: {
        select: {
          id: true,
          name: true,
        }
      },
      role: true 
    }
  });

  return assignedBranches.map((b) => ({
    id: b.branch.id,
    name: b.branch.name,
    userBranchRole: b.role
  }));
}