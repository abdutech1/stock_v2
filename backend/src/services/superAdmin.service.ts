import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import { AppError } from "../utils/AppError.js";
import { UserRole, BranchRole, Plan } from "@prisma/client";

export async function onboardOrganization(data: {
  name: string;
  slug: string;
  adminName: string;
  adminPhone: string;
}) {
  const existingOrg = await prisma.organization.findUnique({ where: { slug: data.slug } });
  if (existingOrg) throw new AppError("Slug already exists", 400);

  const hashedPassword = await bcrypt.hash("123456", 10);

  return await prisma.$transaction(async (tx) => {
    // 1. Create Organization
    const organization = await tx.organization.create({
      data: {
        name: data.name,
        slug: data.slug,
        plan: Plan.FREE,
      },
    });

    // 2. Create the "Main Branch" (Billing logic: only 1 created by default)
    const branch = await tx.branch.create({
      data: {
        name: "Main Branch",
        organizationId: organization.id,
      },
    });

    // 3. Create the Org Admin User
    const user = await tx.user.create({
      data: {
        name: data.adminName,
        phoneNumber: data.adminPhone,
        password: hashedPassword,
        role: UserRole.ORG_ADMIN,
        organizationId: organization.id,
        mustChangePassword: true, // Enforcement
      },
    });

    // 4. Link Admin to the Branch
    await tx.branchUser.create({
      data: {
        userId: user.id,
        branchId: branch.id,
        role: BranchRole.MANAGER,
      },
    });

    return { organization, user, branch };
  });
}


/**
 * CREATE ADDITIONAL BRANCH
 * Only accessible by SUPER_ADMIN. 
 * Used when an Organization pays for an extra branch.
 */
export async function createAdditionalBranch(data: {
  organizationId: number;
  branchName: string;
}) {
  // 1. Verify the organization exists
  const organization = await prisma.organization.findUnique({
    where: { id: data.organizationId },
  });

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  // 2. Create the new branch
  // Note: We don't link a user yet. The Org Admin will do that 
  // via the "Assign Employee to Branch" feature.
  const newBranch = await prisma.branch.create({
    data: {
      name: data.branchName,
      organizationId: data.organizationId,
    },
  });

  return newBranch;
}




export async function getAllOrganizations() {
  return await prisma.organization.findMany({
    where: { deletedAt: null },
    include: {
      _count: {
        select: {
          branches: true,
          users: true,
        },
      },
      subscriptions: {
        where: { isActive: true },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });
}


export async function getOrganizationDetails(orgId: number) {
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    include: {
      branches: true,
      users: {
        where: { role: "ORG_ADMIN" },
        select: { id: true, name: true, phoneNumber: true, isActive: true },
      },
      subscriptions: true,
    },
  });

  if (!org) throw new AppError("Organization not found", 404);
  return org;
}


export async function updateOrganization(orgId: number, data: { 
  name?: string; 
  plan?: Plan; 
  isActive?: boolean 
}) {
  return await prisma.organization.update({
    where: { id: orgId },
    data,
  });
}


export async function deleteOrganization(orgId: number) {
  return await prisma.organization.update({
    where: { id: orgId },
    data: { 
      deletedAt: new Date(),
      isActive: false 
    },
  });
}


export async function updateSubscription(orgId: number, newPlan: Plan) {
  return await prisma.$transaction(async (tx) => {
    // 1. Deactivate current active subscriptions
    await tx.subscription.updateMany({
      where: { organizationId: orgId, isActive: true },
      data: { isActive: false },
    });

    // 2. Create new subscription record
    const subscription = await tx.subscription.create({
      data: {
        organizationId: orgId,
        plan: newPlan,
        startsAt: new Date(),
        endsAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year default
        isActive: true,
      },
    });

    // 3. Update Org plan flag
    await tx.organization.update({
      where: { id: orgId },
      data: { plan: newPlan },
    });

    return subscription;
  });
}



export async function addOrgAdmin(orgId: number, data: { name: string; phoneNumber: string }) {
  const hashedPassword = await bcrypt.hash("123456", 10); // Default password

  return await prisma.user.create({
    data: {
      name: data.name,
      phoneNumber: data.phoneNumber,
      password: hashedPassword,
      role: "ORG_ADMIN",
      organizationId: orgId,
      mustChangePassword: true,
    },
  });
}


export async function superAdminResetPassword(userId: number) {
  const tempPassword = "Reset123!";
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
      mustChangePassword: true,
    },
  });

  return tempPassword;
}


export async function toggleUserStatus(userId: number, isActive: boolean) {
  return await prisma.user.update({
    where: { id: userId },
    data: { isActive },
  });
}


export async function updateBranch(branchId: number, name: string) {
  return await prisma.branch.update({
    where: { id: branchId },
    data: { name }
  });
}