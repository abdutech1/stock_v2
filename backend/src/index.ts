import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";


import authRoutes from "./api/auth/auth.routes.js"; 

import categoryRoutes from "./api/category/category.routes.js";
import priceCategoryRoutes from "./api/pricecategory/pricecategory.routes.js";
import saleRouter from "./api/sale/sale.route.js";
import reportsRoutes from "./api/reports/reports.routes.js";
import expenseRoutes from "./api/expense/expense.routes.js";
import salaryRoutes from "./api/salary/salary.routes.js";
import stockRoutes from "./api/stock/stock.routes.js";
import { authenticate } from "./middleware/authenticate.js";
import { authorize } from "./middleware/authorize.js";
import userRoutes from "./api/users/user.routes.js";
import bonusRuleRoutes from "./api/bonusRules/bonus.routes.js";
import bonusRoutes from "./api/bonus/bonus.routes.js";
import attendanceRoutes from "./api/attendance/attendance.routes.js";
import salaryPreviewRoutes from "./api/salaryPreview/salaryPreview.routes.js";
import adminRoutes from './api/admin/admin.routes.js'
import cookieParser from "cookie-parser";




/* =========================
   MIDDLEWARE
   ========================= */
dotenv.config();

const app = express();
app.set("trust proxy", 1);
app.use(cookieParser());





app.use(cors({
  origin: [
    "http://localhost:3000", 
    "https://zirconic-unsegregable-saniyah.ngrok-free.dev"
   //  "http://192.168.0.101:3000", 
  ],
  credentials: true, 
}));

app.use(express.json());
// app.use("/uploads", express.static("uploads"));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This ensures Express looks at the ROOT uploads folder regardless of where the script runs
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


/* =========================
   PUBLIC ROUTES
   ========================= */

app.use("/api/auth", authRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "OK", time: new Date().toISOString() });
});

/* =========================
   PROTECTED ROUTES
   ========================= */

app.use(authenticate);

app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/salary-preview", salaryPreviewRoutes);

// Owner-only routes
app.use("/api/salaries", authorize("OWNER"), salaryRoutes);

app.use("/api/stocks", authorize("OWNER"), stockRoutes);
app.use("/api/expenses", authorize("OWNER"), expenseRoutes);

// Shared or specific role routes
app.use("/api/reports", reportsRoutes);
app.use("/api/bonus-rules", bonusRuleRoutes);
app.use("/api/bonuses", bonusRoutes);
app.use("/api/sales", saleRouter);
app.use("/api/categories", authorize("OWNER", "EMPLOYEE"), categoryRoutes);
app.use("/api/price-categories", authorize("OWNER", "EMPLOYEE"), priceCategoryRoutes);
app.use("/api/admin", adminRoutes);

/* =========================
   SERVER
   ========================= */
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});