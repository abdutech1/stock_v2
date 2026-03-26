import { Router } from "express";
import { 
  onboardOrgController, 
  createBranchController,
  updateBranchController,
  getAllOrgs, 
  getOrgDetails, 
  updateOrg, 
  deleteOrg,
  addOrgAdminController,
  resetAnyPasswordController,
  toggleUserStatusController,
  upgradeSubscriptionController 
} from "./superAdmin.controller.js";

import { validate } from "../../middleware/validate.js";
import { 
  onboardOrgSchema, 
  createBranchSchema, 
  updateBranchSchema,
  updateOrgSchema,
  upgradePlanSchema,
  addOrgAdminSchema,
  toggleStatusSchema
} from "../../schemas/superAdmin.schema.js";

const router = Router();

// --- ONBOARDING & BRANCHES ---

router.post(
  "/onboard", 
  validate(onboardOrgSchema), 
  onboardOrgController
);

router.post(
  "/organizations/:id/branches", 
  validate(createBranchSchema), 
  createBranchController
);

router.patch(
  "/branches/:branchId", 
  validate(updateBranchSchema), 
  updateBranchController
);

// --- ORGANIZATION MANAGEMENT ---

router.get("/organizations", getAllOrgs);
router.get("/organizations/:id", getOrgDetails);

router.patch(
  "/organizations/:id", 
  validate(updateOrgSchema), 
  updateOrg
);

router.delete("/organizations/:id", deleteOrg);

// --- SUBSCRIPTION & ADMINS ---

router.post(
  "/organizations/:id/upgrade", 
  validate(upgradePlanSchema), 
  upgradeSubscriptionController
);

router.post(
  "/organizations/:id/admins", 
  validate(addOrgAdminSchema), 
  addOrgAdminController
);

router.post(
  "/users/:userId/reset-password", 
  resetAnyPasswordController
);

router.patch(
  "/users/:userId/status", 
  validate(toggleStatusSchema),
  toggleUserStatusController
);

export default router;