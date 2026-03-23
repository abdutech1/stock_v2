import express from "express";
import { previewSalaryController } from "./salaryPreview.controller.js";
import { authorize } from "../../middleware/authorize.js";

const router = express.Router();

// OWNER ONLY
router.post("/", authorize("OWNER"), previewSalaryController);

export default router;
