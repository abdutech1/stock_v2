// src/routes/dashboard.routes.ts
import { Router } from "express";
import { getBranchDashboard } from "./branch-dashboard.controller.js"; 
import { authenticate } from "@/middleware/authenticate.js";
import { authorize } from "@/middleware/authorize.js";
import { validate } from "@/middleware/validate.js";
import { DashboardFilterSchema } from "@/schemas/dashboard.schema.js";
import { UserRole } from "@prisma/client";

const router = Router();

router.use(authenticate);

router.get(
  "/:branchId",
  authorize(UserRole.ORG_ADMIN, UserRole.EMPLOYEE), 
  validate(DashboardFilterSchema), 
  getBranchDashboard
);

export default router;