import express from "express";
import { authorize } from "../../middleware/authorize.js";
import { 
getSalesReportController,
getInventoryReportController,
getEmployeePerformanceReportController,
getFinancialSummaryReportController,
getExpenseReportController, 
getDashboardSummaryController,
 getNavbarAlertsController} from "./reports.controller.js";

const router = express.Router();

router.get("/dashboard", authorize("OWNER", "EMPLOYEE"), getDashboardSummaryController);

router.use(authorize("OWNER"));

router.get("/sales",  getSalesReportController);
router.get("/inventory", getInventoryReportController);
router.get("/employees", getEmployeePerformanceReportController);
router.get("/financial", getFinancialSummaryReportController);
router.get("/expenses", getExpenseReportController);
router.get("/navbar-alerts", getNavbarAlertsController);


export default router;