import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import { AppError } from "../utils/AppError.js";
import { UserRole, BranchRole } from "@prisma/client";




export async function createEmployee(data: {
  name: string;
  phoneNumber: string;
  branchRole: BranchRole;
  branchId: number;
  organizationId: number;
}) {
  const branch = await prisma.branch.findFirst({
    where: { id: data.branchId, organizationId: data.organizationId }
  });
  if (!branch) throw new AppError("Invalid branch selection for your organization", 400);

  const DEFAULT_PWD = "Password123!"; 
  const hashedPassword = await bcrypt.hash(DEFAULT_PWD, 10);

  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: data.name,
        phoneNumber: data.phoneNumber,
        password: hashedPassword,
        role: UserRole.EMPLOYEE,
        organizationId: data.organizationId,
        mustChangePassword: true, 
      }
    });

    await tx.branchUser.create({
      data: {
        userId: user.id,
        branchId: data.branchId,
        role: data.branchRole
      }
    });

    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
}


export async function updateEmployee(id: number, organizationId: number, data: any) {
  const user = await prisma.user.findFirst({ 
    where: { id, organizationId } 
  });

  if (!user) throw new AppError("Employee not found", 404);
  
  // Prevent editing the Org Admin via this route
  if (user.role === UserRole.ORG_ADMIN) {
    throw new AppError("Cannot modify Organization Admin details here", 403);
  }

  return prisma.user.update({
    where: { id },
    data,
  });
}


export async function deactivateEmployee(id: number, organizationId: number, currentUserId: number) {
  const user = await prisma.user.findFirst({
    where: { id, organizationId },
  });

  if (!user) throw new AppError("User not found", 404);
  if (user.role === UserRole.ORG_ADMIN) throw new AppError("Owner cannot be deactivated", 403);
  if (user.id === currentUserId) throw new AppError("You cannot deactivate yourself", 400);

  return await prisma.user.update({
    where: { id },
    data: { isActive: false },
  });
}


export async function getEmployees(organizationId: number) {
  return await prisma.user.findMany({
    where: { 
      organizationId,
      role: UserRole.EMPLOYEE // Only return staff, not the owner
    },
    include: {
      branches: {
        include: { branch: { select: { name: true } } }
      }
    },
    orderBy: { createdAt: "desc" },
  });
}


export async function activateEmployee(id: number, organizationId: number) {
  const user = await prisma.user.findFirst({
    where: { id, organizationId },
  });

  if (!user) throw new AppError("Employee not found", 404);
  if (user.isActive) throw new AppError("Employee is already active", 400);

  return await prisma.user.update({
    where: { id },
    data: { isActive: true },
  });
}


export async function getEmployeeById(id: number, organizationId: number) {
  const user = await prisma.user.findFirst({
    where: { id, organizationId },
    include: {
      branches: {
        include: { branch: { select: { name: true } } }
      }
    }
  });

  if (!user) throw new AppError("Employee not found", 404);
  return user;
}


export async function getDeactivatedEmployees(organizationId: number) {
  return await prisma.user.findMany({
    where: { 
      organizationId,
      isActive: false,
      role: UserRole.EMPLOYEE 
    },
    include: {
      branches: {
        include: { branch: { select: { name: true } } }
      }
    },
    orderBy: { updatedAt: "desc" },
  });
}


/**
 * TRANSFER EMPLOYEE
 * Moves an employee from one branch to another within the same Organization.
 */
export async function transferEmployee(
  employeeId: number, 
  organizationId: number, 
  newBranchId: number
) {
  // 1. Verify the new branch belongs to this Org
  const targetBranch = await prisma.branch.findFirst({
    where: { id: newBranchId, organizationId }
  });
  if (!targetBranch) throw new AppError("Target branch not found in your organization", 404);

  // 2. Update the BranchUser record
  // We use updateMany because a user *should* only have one active branch link in this specific flow
  return await prisma.branchUser.updateMany({
    where: { userId: employeeId },
    data: { branchId: newBranchId }
  });
}