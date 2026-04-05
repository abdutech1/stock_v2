import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import { AppError } from "../utils/AppError.js";
import { UserRole, BranchRole } from "@prisma/client";


export interface CreateEmployeeInput {
  name: string;
  phoneNumber: string;
  branchRole: BranchRole;
  branchId: number;
  organizationId: number;
  baseSalary: number;
}

export interface UpdateEmployeeInput {
  name?: string;
  phoneNumber?: string;
  isActive?: boolean;
  baseSalary?: number;
  branchRole?: BranchRole;
  branchId?: number;
}


export async function createEmployee(data: CreateEmployeeInput) {
  // Security: Ensure the target branch actually belongs to the admin's organization
  const branch = await prisma.branch.findFirst({
    where: { id: data.branchId, organizationId: data.organizationId }
  });

  if (!branch) {
    throw new AppError("Branch not found or does not belong to your organization", 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: { phoneNumber: data.phoneNumber }
  });

  if (existingUser) {
    throw new AppError("An account with this phone number already exists", 400);
  }

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
        baseSalary: data.baseSalary, // SAVE SALARY HERE
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






export async function getEmployees(organizationId: number, branchId?: number) {
  return await prisma.user.findMany({
    where: { 
      organizationId,
      role: UserRole.EMPLOYEE,
      deletedAt: null,
      ...(branchId ? { branches: { some: { branchId } } } : {})
    },
    select: {
      id: true,
      name: true,
      phoneNumber: true,
      isActive: true,
      baseSalary: true,
      branches: {
        select: {
          role: true,
          branch: { select: { name: true } }
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });
}




export async function updateEmployee(id: number, organizationId: number, data: UpdateEmployeeInput) {
  const user = await prisma.user.findFirst({ 
    where: { id, organizationId, deletedAt: null } 
  });

  if (!user) throw new AppError("Employee not found", 404);
  if (user.role === UserRole.ORG_ADMIN) {
    throw new AppError("Organization Admins must be managed through account settings", 403);
  }

  return await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      phoneNumber: data.phoneNumber,
      baseSalary: data.baseSalary, 
      
      ...(data.branchRole || data.branchId ? {
        branches: {
          updateMany: {
            where: { userId: id },
            data: {
              ...(data.branchRole && { role: data.branchRole }),
              ...(data.branchId && { branchId: data.branchId }),
            },
          },
        },
      } : {}),
    },
    select: {
      id: true,
      name: true,
      phoneNumber: true,
      isActive: true,
      baseSalary: true,
      branches: {
        select: {
          role: true,
          branch: { select: { name: true } }
        }
      }
    },
  });
}

export async function toggleEmployeeStatus(id: number, organizationId: number, currentUserId: number) {
  const user = await prisma.user.findFirst({
    where: { id, organizationId },
  });

  if (!user) throw new AppError("Employee not found", 404);
  if (user.id === currentUserId) throw new AppError("You cannot deactivate your own account", 400);
  if (user.role === UserRole.ORG_ADMIN) throw new AppError("The Owner account cannot be disabled", 403);

  return await prisma.user.update({
    where: { id },
    data: { isActive: !user.isActive },
  });
}


export async function getEmployeeById(id: number, organizationId: number) {
  const user = await prisma.user.findFirst({
    where: { id, organizationId, deletedAt: null },
    include: {
      branches: {
        include: { branch: { select: { name: true } } }
      }
    }
  });
  if (!user) throw new AppError("Employee not found", 404);
  return user;
}


export async function activateEmployee(id: number, organizationId: number) {
  return await prisma.user.update({
    where: { id },
    data: { isActive: true },
  });
}


export async function deactivateEmployee(id: number, organizationId: number, currentUserId: number) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (user?.id === currentUserId) throw new AppError("You cannot deactivate yourself", 400);
  
  return await prisma.user.update({
    where: { id },
    data: { isActive: false },
  });
}

export async function getDeactivatedEmployees(organizationId: number) {
  return await prisma.user.findMany({
    where: { organizationId, isActive: false, role: UserRole.EMPLOYEE },
    include: {
      branches: { include: { branch: { select: { name: true } } } }
    }
  });
}


export async function transferEmployee(employeeId: number, organizationId: number, newBranchId: number, newRole: BranchRole) {
  const targetBranch = await prisma.branch.findFirst({
    where: { id: newBranchId, organizationId }
  });

  if (!targetBranch) throw new AppError("Target branch invalid", 404);

  return await prisma.$transaction(async (tx) => {
    // Remove existing branch links within this Org
    await tx.branchUser.deleteMany({
      where: { 
        userId: employeeId,
        branch: { organizationId } 
      }
    });

    // Create new link
    return await tx.branchUser.create({
      data: {
        userId: employeeId,
        branchId: newBranchId,
        role: newRole
      }
    });
  });
}