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

const router = Router();


router.get("/", authorize(UserRole.ORG_ADMIN, UserRole.EMPLOYEE), getEmployeesController);

router.get("/:id", authorize(UserRole.ORG_ADMIN, UserRole.EMPLOYEE), getEmployeeController);


router.use(authorize(UserRole.ORG_ADMIN));

router.get("/list/deactivated", getDeactivatedEmployeesController);



router.post("/", validate(createEmployeeSchema), createEmployeeController);

router.patch("/:id", validate(updateEmployeeSchema), updateEmployeeController);

router.patch("/:id/activate", activateEmployeeController);

router.delete("/:id", deactivateEmployeeController);

router.patch(
  "/:id/transfer", 
  validate(transferEmployeeSchema), 
  transferEmployeeController 
);

export default router;