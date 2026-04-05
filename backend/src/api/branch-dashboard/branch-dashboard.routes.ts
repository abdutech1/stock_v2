import { Router } from "express";
import { getBranchDashboard } from "./branch-dashboard.controller.js"; 
import { authenticate } from "@/middleware/authenticate.js";
import { authorize } from "@/middleware/authorize.js";
import { validate } from "@/middleware/validate.js";
import { DashboardFilterSchema } from "@/schemas/dashboard.schema.js";
import { UserRole } from "@prisma/client";

const router = Router();

// 1. All routes here require being logged in
router.use(authenticate);

/**
 * GET /api/branch-dashboard/current
 * SHORTCUT: Uses the branchId stored in the user's JWT/Session
 * Place this BEFORE /:branchId so "current" isn't treated as a parameter
 */
router.get(
  "/current",
  authorize(UserRole.ORG_ADMIN, UserRole.EMPLOYEE),
  (req, res, next) => {
    // If the user just switched branches, their new branchId is in req.user
    if (!req.user?.branchId) {
       // Optional: fallback or error if no branch is selected yet
       req.params.branchId = "0"; 
    } else {
       req.params.branchId = String(req.user.branchId);
    }
    next();
  },
  validate(DashboardFilterSchema),
  getBranchDashboard
);

/**
 * GET /api/branch-dashboard/:branchId
 * MANUAL: Used when an Admin wants to jump between specific branch dashboards
 */
router.get(
  "/:branchId",
  authorize(UserRole.ORG_ADMIN, UserRole.EMPLOYEE), 
  validate(DashboardFilterSchema), 
  getBranchDashboard
);

export default router;