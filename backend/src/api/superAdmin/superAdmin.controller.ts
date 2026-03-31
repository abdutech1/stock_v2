import { Request, Response } from "express";
import { onboardOrganization, createAdditionalBranch } from "../../services/superAdmin.service.js";
import prisma from "@/prismaClient.js";
import { AppError } from "@/utils/AppError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import * as superAdminService from "../../services/superAdmin.service.js";

export async function onboardOrgController(req: Request, res: Response) {
  try {
    const result = await onboardOrganization(req.body);
    res.status(201).json({
      status: "success",
      message: "Organization onboarded successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
}


export async function createBranchController(req: Request, res: Response) {
  try {
    const { organizationId, branchName } = req.body;

    if (!organizationId || !branchName) {
      throw new AppError("Organization ID and Branch Name are required", 400);
    }

    const branch = await createAdditionalBranch({ organizationId, branchName });

    res.status(201).json({
      status: "success",
      message: "New branch created successfully",
      data: branch,
    });
  } catch (error: any) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
}



export const getAllOrgs = catchAsync(async (req: Request, res: Response) => {
  const orgs = await superAdminService.getAllOrganizations();
  res.status(200).json({ status: "success", data: orgs });
});

export const getOrgDetails = catchAsync(async (req: Request, res: Response) => {
  const org = await superAdminService.getOrganizationDetails(Number(req.params.id));
  res.status(200).json({ status: "success", data: org });
});

export const updateOrg = catchAsync(async (req: Request, res: Response) => {
  const updated = await superAdminService.updateOrganization(Number(req.params.id), req.body);
  res.status(200).json({ status: "success", data: updated });
});

export const deleteOrg = catchAsync(async (req: Request, res: Response) => {
  await superAdminService.deleteOrganization(Number(req.params.id));
  res.status(204).json({ status: "success", data: null });
});




export const addOrgAdminController = catchAsync(async (req: Request, res: Response) => {
  const orgId = Number(req.params.id);
  const { name, phoneNumber } = req.body;

  const newAdmin = await superAdminService.addOrgAdmin(orgId, { name, phoneNumber });

  res.status(201).json({
    status: "success",
    message: "Additional Organization Admin created successfully",
    data: { 
      id: newAdmin.id, 
      name: newAdmin.name, 
      role: newAdmin.role 
    },
  });
});




export const resetAnyPasswordController = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  // We fetch the user name first just to make the message clearer
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found", 404);

  const tempPassword = await superAdminService.superAdminResetPassword(userId);

  res.status(200).json({
    status: "success",
    message: `Password for ${user.name} has been reset.`,
    data: { 
      tempPassword,
      instructions: "Please copy this password. It will not be shown again." 
    },
  });
});


export const toggleUserStatusController = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const { isActive } = req.body;

  const updatedUser = await superAdminService.toggleUserStatus(userId, isActive);

  res.status(200).json({
    status: "success",
    message: `User ${isActive ? "activated" : "deactivated"} successfully`,
    data: { 
      id: updatedUser.id, 
      isActive: updatedUser.isActive 
    },
  });
});



export const upgradeSubscriptionController = catchAsync(async (req: Request, res: Response) => {
  const orgId = Number(req.params.id);
  const { plan } = req.body;

  const sub = await superAdminService.updateSubscription(orgId, plan);

  res.status(200).json({
    status: "success",
    message: `Organization successfully moved to ${plan} plan.`,
    data: sub,
  });
});

export const updateBranchController = catchAsync(async (req: Request, res: Response) => {
  const branchId = Number(req.params.branchId);
  const { name } = req.body;
  const updated = await superAdminService.updateBranch(branchId, name);
  res.status(200).json({ status: "success", data: updated });
});



export const toggleBranchStatusController = catchAsync(async (req: Request, res: Response) => {
  const branchId = Number(req.params.branchId);
  const { isActive } = req.body;

  const updatedBranch = await superAdminService.toggleBranchStatus(branchId, isActive);

  res.status(200).json({
    status: "success",
    message: `Branch ${isActive ? "activated" : "deactivated"} successfully`,
    data: updatedBranch,
  });
});

export const deleteBranchController = catchAsync(async (req: Request, res: Response) => {
  const branchId = Number(req.params.branchId);
  
  await superAdminService.deleteBranch(branchId);

  res.status(204).json({
    status: "success",
    data: null,
  });
});