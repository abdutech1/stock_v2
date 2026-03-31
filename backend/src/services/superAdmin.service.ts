import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import { AppError } from "../utils/AppError.js";
import { UserRole, BranchRole, Plan } from "@prisma/client";


export async function onboardOrganization(data: {
  name: string;
  slug: string;
  adminName: string;
  adminPhone: string;
  plan?: Plan;
}) {

  // 1. Check if Organization Slug is taken
  const existingOrg = await prisma.organization.findUnique({ where: { slug: data.slug } });
  if (existingOrg) throw new AppError("This organization slug is already in use.", 400);

  // 2. CHECK IF PHONE NUMBER IS TAKEN (New Check)
  const existingUser = await prisma.user.findUnique({ where: { phoneNumber: data.adminPhone } });
  if (existingUser) {
    throw new AppError("This phone number is already registered to another user.", 400);
  }

  const hashedPassword = await bcrypt.hash("123456", 10);
  const selectedPlan = data.plan || Plan.FREE;

  return await prisma.$transaction(async (tx) => {
    // 1. Create Organization
    const organization = await tx.organization.create({
      data: {
        name: data.name,
        slug: data.slug,
        plan: selectedPlan,
      },
    });

    // 2. Subscription Logic
    const startsAt = new Date();
    const endsAt = new Date();

    if (selectedPlan === Plan.FREE) {
      // Free plan = 30 days
      endsAt.setDate(startsAt.getDate() + 30);
    } else {
      // All other paid plans = 1 year
      endsAt.setFullYear(startsAt.getFullYear() + 1);
    }

    await tx.subscription.create({
      data: {
        organizationId: organization.id,
        plan: selectedPlan,
        startsAt,
        endsAt,
        isActive: true,
      },
    });

    // 3. Create Main Branch
    const branch = await tx.branch.create({
      data: {
        name: "Main Branch",
        organizationId: organization.id,
      },
    });

    // 4. Create Org Admin
    const user = await tx.user.create({
      data: {
        name: data.adminName,
        phoneNumber: data.adminPhone,
        password: hashedPassword,
        role: UserRole.ORG_ADMIN,
        organizationId: organization.id,
        mustChangePassword: true,
      },
    });

    // 5. Link Admin to Branch
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





export async function createAdditionalBranch(data: {
  organizationId: number;
  branchName: string;
}) {
  // 1. Verify the organization exists and get its current plan
  const organization = await prisma.organization.findUnique({
    where: { id: data.organizationId },
    select: { 
      id: true, 
      plan: true,
      _count: {
        select: { 
          branches: { 
            where: { deletedAt: null } // Only count active branches
          } 
        }
      }
    }
  });

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  const currentBranchCount = organization._count.branches;
  const plan = organization.plan;

  // 2. Enforce Plan Limits
  // FREE = 1, BASIC = 1, PRO = 5, ENTERPRISE = Unlimited
  if (plan === "FREE" && currentBranchCount >= 1) {
    throw new AppError("FREE plan is limited to 1 branch. Upgrade to PRO for more.", 400);
  }
  
  if (plan === "BASIC" && currentBranchCount >= 1) {
    throw new AppError("BASIC plan is limited to 1 branch. Upgrade to PRO for more.", 400);
  }

  if (plan === "PRO" && currentBranchCount >= 5) {
    throw new AppError("PRO plan is limited to 5 branches. Upgrade to ENTERPRISE for unlimited.", 400);
  }

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
      branches: {
        where: { deletedAt: null } 
      },
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

    // 2. Set duration based on plan
    const endsAt = new Date();
    newPlan === Plan.FREE 
      ? endsAt.setDate(endsAt.getDate() + 30) 
      : endsAt.setFullYear(endsAt.getFullYear() + 1);

    const subscription = await tx.subscription.create({
      data: {
        organizationId: orgId,
        plan: newPlan,
        startsAt: new Date(),
        endsAt,
        isActive: true,
      },
    });

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
  // Generate a slightly more complex random-ish temp password
  const tempPassword = `Reset@${Math.floor(1000 + Math.random() * 9000)}`;
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
      mustChangePassword: true, // Forces them to change it on next login
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



export async function toggleBranchStatus(branchId: number, isActive: boolean) {
  return await prisma.branch.update({
    where: { id: branchId },
    data: { isActive },
  });
}

export async function deleteBranch(branchId: number) {
  return await prisma.branch.update({
    where: { id: branchId },
    data: { 
      deletedAt: new Date(),
      isActive: false 
    },
  });
}