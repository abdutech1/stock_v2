import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";
import { UserRole } from "../generated/prisma/enums.js";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "8h";

export async function registerOwner(data: {
  name: string;
  phoneNumber: string;
  password: string;
}) {
  const existingOwner = await prisma.user.findFirst({
    where: { role: UserRole.OWNER },
  });

  if (existingOwner) {
    throw new Error("Owner already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const owner = await prisma.user.create({
    data: {
      name: data.name,
      phoneNumber: data.phoneNumber,
      password: hashedPassword,
      role: UserRole.OWNER,
      mustChangePassword: false,
    },
  });

  return owner;
}


export async function login(
  phoneNumber: string,
  password: string,
  meta?: { ip?: string; userAgent?: string }
) {
  const user = await prisma.user.findUnique({
    where: { phoneNumber },
  });

  // ── Specific error cases ──
  if (!user) {
    throw new Error("Invalid phone number or password");
    // We will  also use a custom error class later
    // throw new AuthenticationError("User not found");
  }

  if (!user.isActive) {
    throw new Error("Account is inactive. Please contact admin.");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error("Invalid phone number or password");
  }

  // ── Success path ──
  const token = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

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
    },
  };
}


export async function changePassword(
  userId: number,
  oldPassword: string,
  newPassword: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) {
    throw new Error("Old password is incorrect");
  }

  const sameAsOld = await bcrypt.compare(newPassword, user.password);
  if (sameAsOld) {
    throw new Error("New password cannot be the same as the current password");
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashed,
      mustChangePassword: false,
    },
  });
}


export async function resetEmployeePassword(
  employeeId: number
) {
  const user = await prisma.user.findUnique({
    where: { id: employeeId },
  });

  if (!user) throw new Error("User not found");

  const tempPassword = "123456";
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



export async function getMe(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      phoneNumber: true,
      role: true,
      isActive: true,
      mustChangePassword: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
