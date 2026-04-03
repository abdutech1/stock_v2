import { Router } from "express";
import { getGlobalOverviewController } from "./report.controller.js";
import { authorize } from "../../middleware/authorize.js";
import { UserRole } from "@prisma/client";

const router = Router();

router.get(
  "/", 
  authorize(UserRole.ORG_ADMIN), 
  getGlobalOverviewController
);

export default router;