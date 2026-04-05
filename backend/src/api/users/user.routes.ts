import { Router } from "express";
import {
  createEmployeeController,
  updateEmployeeController,
  deactivateEmployeeController,
  getEmployeesController,
  getEmployeeController,
  getDeactivatedEmployeesController,
  activateEmployeeController,
  transferEmployeeController
} from "./user.controller.js";



import { authorize } from "../../middleware/authorize.js";
import { createEmployeeSchema, updateEmployeeSchema, transferEmployeeSchema } from "../../schemas/user.schema.js";
import { validate } from "../../middleware/validate.js";
import { UserRole } from "@prisma/client";

import { checkSubscription } from "@/middleware/checkSubscription.js";

const router = Router();

// Standardize: Everyone can see the team
router.get("/", authorize(UserRole.ORG_ADMIN, UserRole.EMPLOYEE), getEmployeesController);
router.get("/:id", authorize(UserRole.ORG_ADMIN, UserRole.EMPLOYEE), getEmployeeController);

// Strict Admin Only: Management Actions
router.use(authorize(UserRole.ORG_ADMIN));

router.get("/list/deactivated", getDeactivatedEmployeesController);

// Create / Update / Transfer
router.post("/", checkSubscription, validate(createEmployeeSchema), createEmployeeController);
router.patch("/:id", checkSubscription, validate(updateEmployeeSchema), updateEmployeeController);
router.patch("/:id/transfer", checkSubscription, validate(transferEmployeeSchema), transferEmployeeController);

// Status Toggles
router.patch("/:id/activate", checkSubscription, activateEmployeeController);
router.delete("/:id", checkSubscription, deactivateEmployeeController); // Soft-delete/Deactivate

export default router;