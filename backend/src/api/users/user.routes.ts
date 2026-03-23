import { Router } from "express";
import {
  createEmployeeController,
  updateEmployeeController,
  deactivateEmployeeController,
  getEmployeesController,
  getEmployeeController,
  getDeactivatedEmployeesController,
  activateEmployeeController
} from "./user.controller.js";

import { authorize } from "../../middleware/authorize.js";
import { createEmployeeSchema, updateEmployeeSchema } from "../../schemas/user.schema.js";
import { validate } from "../../middleware/validate.js";

const router = Router();

router.get("/", authorize("OWNER", "EMPLOYEE"), getEmployeesController);

router.use(authorize("OWNER"));

// router.get("/deactivated", getDeactivatedEmployeesController);
// router.patch("/:id/activate", activateEmployeeController);
// router.post("/", validate(createEmployeeSchema), createEmployeeController);
// router.get("/", getEmployeesController);
// router.get("/:id", getEmployeeController);
// router.patch("/:id", validate(updateEmployeeSchema), updateEmployeeController);
// router.delete("/:id", deactivateEmployeeController);

router.get("/deactivated", getDeactivatedEmployeesController);
router.patch("/:id/activate", activateEmployeeController);
router.post("/", validate(createEmployeeSchema), createEmployeeController);
router.get("/:id", getEmployeeController);
router.patch("/:id", validate(updateEmployeeSchema), updateEmployeeController);
router.delete("/:id", deactivateEmployeeController);

export default router;
