import { Router } from "express";
import {
  registerOwnerController,
  loginController,
  changePasswordController,
  resetEmployeePasswordController
} from "../auth/auth.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import {authorize} from '../../middleware/authorize.js'
import { validate } from "../../middleware/validate.js";
import { logoutController,meController } from "../auth/auth.controller.js";


import {
  registerOwnerSchema,
  loginSchema,
  changePasswordSchema,
  resetEmployeePasswordSchema
} from "../../schemas/auth.schema.js";

const router = Router();

router.post(
  "/register-owner",
  validate(registerOwnerSchema),
  registerOwnerController
);

router.post("/login", validate(loginSchema), loginController);
router.post("/logout", logoutController);


router.get("/me", authenticate, meController);


router.post(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  changePasswordController
);

router.post(
  "/reset-password",
  authenticate,
  authorize("OWNER"),
  validate(resetEmployeePasswordSchema), 
  resetEmployeePasswordController       
);

export default router;
