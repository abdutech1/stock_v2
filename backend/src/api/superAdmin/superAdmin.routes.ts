// import { Router } from "express";
// import { 
//   onboardOrgController, 
//   createBranchController,
//   updateBranchController,
//   getAllOrgs, 
//   getOrgDetails, 
//   updateOrg, 
//   deleteOrg,
//   addOrgAdminController,
//   resetAnyPasswordController,
//   toggleUserStatusController,
//   upgradeSubscriptionController 
// } from "./superAdmin.controller.js";

// import { validate } from "../../middleware/validate.js";
// import { 
//   onboardOrgSchema, 
//   createBranchSchema, 
//   updateBranchSchema,
//   updateOrgSchema,
//   upgradePlanSchema,
//   addOrgAdminSchema,
//   toggleStatusSchema
// } from "../../schemas/superAdmin.schema.js";

// const router = Router();

// // --- Organization Management ---

// router.post("/onboard", validate(onboardOrgSchema), onboardOrgController);
// router.post("/organizations/:id/branches", validate(createBranchSchema), createBranchController);
// router.patch("/branches/:branchId", validate(updateBranchSchema), updateBranchController);
// router.get("/organizations", getAllOrgs);
// router.get("/organizations/:id", getOrgDetails);
// router.patch("/organizations/:id", validate(updateOrgSchema), updateOrg);
// router.delete("/organizations/:id", deleteOrg);

// // --- SUBSCRIPTION & ADMINS ---

// router.post(
//   "/organizations/:id/upgrade", 
//   validate(upgradePlanSchema), 
//   upgradeSubscriptionController
// );

// router.post(
//   "/organizations/:id/admins", 
//   validate(addOrgAdminSchema), 
//   addOrgAdminController
// );

// router.post(
//   "/users/:userId/reset-password", 
//   resetAnyPasswordController
// );

// router.patch(
//   "/users/:userId/status", 
//   validate(toggleStatusSchema),
//   toggleUserStatusController
// );

// export default router;


import { Router } from "express";
import * as ctrl from "./superAdmin.controller.js"; // Cleaner import
import { validate } from "../../middleware/validate.js";
import * as schema from "../../schemas/superAdmin.schema.js";

const router = Router();

// --- Organization & Branch Management ---
router.post("/onboard", validate(schema.onboardOrgSchema), ctrl.onboardOrgController);
router.get("/organizations", ctrl.getAllOrgs);
router.get("/organizations/:id", ctrl.getOrgDetails);

// Corrected to :organizationId to match controller destructuring
router.post("/organizations/:organizationId/branches", validate(schema.createBranchSchema), ctrl.createBranchController);

// Unified Update: Handles both metadata and the isActive toggle
router.patch("/organizations/:id", validate(schema.updateOrgSchema), ctrl.updateOrg);
router.delete("/organizations/:id", ctrl.deleteOrg);

// --- Branch Actions ---
router.patch("/branches/:branchId", validate(schema.updateBranchSchema), ctrl.updateBranchController);
router.post("/organizations/:id/upgrade", validate(schema.upgradePlanSchema), ctrl.upgradeSubscriptionController);
router.patch("/branches/:branchId/status",validate(schema.toggleStatusSchema), ctrl.toggleBranchStatusController);
router.delete("/branches/:branchId", ctrl.deleteBranchController);

// --- Admin & User Management ---
router.post("/organizations/:id/admins", validate(schema.addOrgAdminSchema), ctrl.addOrgAdminController);
router.post("/users/:userId/reset-password", ctrl.resetAnyPasswordController);
router.patch("/users/:userId/status", validate(schema.toggleStatusSchema), ctrl.toggleUserStatusController);

export default router;