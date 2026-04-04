// src/controllers/dashboard.controller.ts
import { Request, Response } from "express";
import { catchAsync } from "@/utils/catchAsync.js";
import { AppError } from "@/utils/AppError.js";
import { getBranchDashboardData } from "@/services/branch-dashboard.service.js";
import prisma from "@/prismaClient.js";
import { UserRole } from "@prisma/client";

export const getBranchDashboard = catchAsync(async (req: Request, res: Response) => {
  const { branchId } = req.params;
  const { startDate, endDate } = req.query;
  const user = req.user!; 
  const targetBranchId = Number(branchId);

  // --- Tier 1: SUPER_ADMIN ---
  if (user.role === UserRole.SUPER_ADMIN) {
    // Immediate access
  } 
  
  // --- Tier 2: ORG_ADMIN ---
  else if (user.role === UserRole.ORG_ADMIN) {
    // Must verify the branch belongs to their organization
    const branch = await prisma.branch.findFirst({
      where: { 
        id: targetBranchId,
        organizationId: user.organizationId 
      },
    });

    if (!branch) {
      throw new AppError("Access Denied: Branch not found in your organization.", 403);
    }
  } 

  // --- Tier 3: EMPLOYEE (Managers, Cashiers, etc.) ---
  else if (user.role === UserRole.EMPLOYEE) {
    // Must be explicitly linked to this branch in the BranchUser table
    const hasBranchAccess = await prisma.branchUser.findUnique({
      where: {
        userId_branchId: {
          userId: user.id,
          branchId: targetBranchId,
        },
      },
    });

    if (!hasBranchAccess) {
      throw new AppError("Access Denied: You are not assigned to this branch.", 403);
    }
  }

  // 3. Execute Service
  const dashboardData = await getBranchDashboardData({
    branchId: targetBranchId,
    startDate: startDate as unknown as Date,
    endDate: endDate as unknown as Date,
  });

  // 4. Response
  res.status(200).json({
    status: "success",
    data: { 
      dashboard: dashboardData,
      timestamp: new Date().toISOString() 
    },
  });
});