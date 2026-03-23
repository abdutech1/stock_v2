import cron from "node-cron";
import { runDailyStockAlert } from "../../jobs/dailyStockAlert.job.js";

cron.schedule("0 8 * * *", runDailyStockAlert);


