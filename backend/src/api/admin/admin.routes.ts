// src/api/admin/admin.routes.ts
import { Router } from "express";
import { runDailyStockAlert } from "../../jobs/dailyStockAlert.job.js";

const router = Router();

router.post("/test-stock-alert", async (_req, res) => {
  await runDailyStockAlert();
  res.json({ message: "Stock alert job executed" });
});

export default router;
