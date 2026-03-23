import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import { UserRole } from "../generated/prisma/enums.js";

export interface CreateEmployeeInput {
  name: string;
  phoneNumber: string;
  baseSalary?: number;
  role?: UserRole;
}

export interface UpdateEmployeeInput {
  name?: string;
  phoneNumber?: string;
  baseSalary?: number;
  isActive?: boolean;
}


// Create employee
export async function createEmployee(data: CreateEmployeeInput) {
  const defaultPassword = "123456"; 
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  return await prisma.user.create({
    data: {
      name: data.name,
      phoneNumber: data.phoneNumber,
      password: hashedPassword,      
      mustChangePassword: true,      
      baseSalary: data.baseSalary ?? 0,
      role: UserRole.EMPLOYEE,
      isActive: true,                
    },
  });
}

// Update employee
export async function updateEmployee(id: number, data: UpdateEmployeeInput) {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === UserRole.OWNER) {
    throw new Error("OWNER role cannot be modified");
  }

  return prisma.user.update({
    where: { id },
    data,
  });
}


// Soft-delete employee


// Add currentUserId as a second parameter
export async function deactivateEmployee(id: number, currentUserId: number) {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === "OWNER") {
    throw new Error("Owner account cannot be deactivated");
  }

  // Use currentUserId here instead of req.user.id
  if (user.id === currentUserId) {
    throw new Error("You cannot deactivate your own account");
  }

  return await prisma.user.update({
    where: { id },
    data: { isActive: false },
  });
}

export async function getEmployees() {
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
}


// Get single employee by ID
export async function getEmployeeById(id: number) {
  return await prisma.user.findUnique({
    where: { id },
  });
}


// Get deactivated employees
export async function getDeactivatedEmployees() {
  return await prisma.user.findMany({
    where: { isActive: false },
    orderBy: { createdAt: "desc" },
  });
}


export async function activateEmployee(id: number) {
  const employee = await prisma.user.findUnique({
    where: { id },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  if (employee.isActive) {
    throw new Error("Employee is already active");
  }

  return await prisma.user.update({
    where: { id },
    data: { isActive: true },
  });
}


