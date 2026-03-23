import express from "express";
import {
  paySalary,
  getSalaries,
  getSalaryReport,
  updateSalary,
  deleteSalary
} from "./salary.controller.js";
import { authorize } from "../../middleware/authorize.js";

const router = express.Router();

// OWNER ONLY
router.post("/", authorize("OWNER"), paySalary);
router.get("/", authorize("OWNER"), getSalaries);
router.get("/report", authorize("OWNER"), getSalaryReport);
router.patch("/:id", authorize("OWNER"), updateSalary);
router.delete("/:id", authorize("OWNER"), deleteSalary);

export default router;


