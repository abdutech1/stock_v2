import { Router } from "express";
import {
  loginController,
  logoutController,
  meController,
  changePasswordController,
  resetEmployeePasswordController,
  switchBranchController,
  getMyBranchesController
} from "./auth.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { UserRole } from "@prisma/client"; 

import {
  loginSchema,
  changePasswordSchema,
  resetEmployeePasswordSchema,
  switchBranchSchema
} from "../../schemas/auth.schema.js";

const router = Router();


router.post(
  "/login", 
  validate(loginSchema), 
  loginController
);

router.post("/logout", logoutController);

/* =========================
   PROTECTED ROUTES
   ========================= */

router.use(authenticate);

router.get("/me", meController);

router.post(
  "/change-password",
  validate(changePasswordSchema),
  changePasswordController
);

router.post(
  "/reset-password",
  authorize(UserRole.ORG_ADMIN, UserRole.SUPER_ADMIN), 
  validate(resetEmployeePasswordSchema), 
  resetEmployeePasswordController       
);

router.post(
  "/switch-branch",
  authorize(UserRole.ORG_ADMIN, UserRole.SUPER_ADMIN),
  validate(switchBranchSchema),
  switchBranchController
);

router.get(
  "/my-branches",
  authorize(UserRole.ORG_ADMIN, UserRole.SUPER_ADMIN),
  getMyBranchesController
);

export default router;