import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";
import { AppError } from "../utils/AppError.js";


const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "8h";



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
    { expiresIn: JWT_EXPIRES_IN }
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
  // 1. Verify the user belongs to this branch AND get their role
  const branchUser = await prisma.branchUser.findUnique({
    where: {
      userId_branchId: { userId, branchId: targetBranchId },
    },
    include: {
      user: {
        select: { 
          id: true, 
          role: true, 
          organizationId: true, 
          name: true, 
          mustChangePassword: true 
        }
      }
    }
  });

  // 2. Security Check: Access + Role Check
  if (!branchUser) {
    throw new AppError("You do not have access to this branch", 403);
  }

  if (branchUser.user.role === "EMPLOYEE") {
    throw new AppError("Employees are not permitted to switch branches", 403);
  }

  // 3. Generate a NEW token with the updated branchId
  const newToken = jwt.sign(
    {
      id: branchUser.user.id,
      role: branchUser.user.role,
      organizationId: branchUser.user.organizationId,
      branchId: targetBranchId, 
    },
    process.env.JWT_SECRET!,
    { expiresIn: "8h" }
  );

  return { 
    token: newToken, 
    user: {
      ...branchUser.user,
      branchId: targetBranchId 
    } 
  };
}





export async function resetEmployeePassword(employeeId: number, organizationId: number) {
  const user = await prisma.user.findFirst({
    where: { id: employeeId, organizationId },
  });

  if (!user) throw new AppError("Employee not found in your organization", 404);

  const tempPassword = "Password123!";
  const hashed = await bcrypt.hash(tempPassword, 10);

  await prisma.user.update({
    where: { id: employeeId },
    data: {
      password: hashed,
      mustChangePassword: true, // Forces change on their next login
    },
  });

  return tempPassword;
}



export async function getMyBranches(userId: number) {
  const userWithBranches = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      branches: {
        select: {
          branch: {
            select: {
              id: true,
              name: true,
            }
          },
          role: true 
        }
      }
    }
  });

  if (!userWithBranches) throw new AppError("User not found", 404);
  return userWithBranches.branches.map((b) => ({
    id: b.branch.id,
    name: b.branch.name,
    userBranchRole: b.role
  }));
}
