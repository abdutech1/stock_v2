// attendance.routes.ts
import { Router } from "express";
import { authorize } from "../../middleware/authorize.js";
import {
  markAttendanceController,
  getAttendanceForDate,
  getAttendanceForUser,
  getBulkAttendanceController
} from "./attendance.controller.js";
import { validate } from "../../middleware/validate.js";
import {
  markAttendanceSchema,
  getAttendanceByDateQuerySchema,
  getAttendanceByUserQuerySchema,
} from "../../schemas/attendance.schema.js";

const router = Router();

router.post("/",authorize("OWNER"),validate(markAttendanceSchema),markAttendanceController);

// router.get(
//   "/", 
//   authorize("OWNER"), 
//   validate(getAttendanceByDateQuerySchema, "query"), 
//   getAttendanceForDate
// );
router.get("/date", authorize("OWNER"), validate(getAttendanceByDateQuerySchema, "query"), getAttendanceForDate);

// attendance.routes.ts
router.get("/bulk", authorize("OWNER"), getBulkAttendanceController);

router.get(
  "/user/:userId", 
  authorize("OWNER"), 
  validate(getAttendanceByUserQuerySchema, "query"), 
  getAttendanceForUser
);

export default router;

