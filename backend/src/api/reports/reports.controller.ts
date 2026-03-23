import { Request, Response } from "express";
import { getSalesReport } from "../../services/reports/sale.service.js"; 
import {getInventoryReport} from '../../services/reports/inventoryReport.service.js'
import {getEmployeePerformanceReport} from '../../services/reports/employeePerformance.service.js'
import {getFinancialSummaryReport} from '../../services/reports/finincial.service.js'
import { getExpenseReport} from '../../services/reports/expense.service.js'
import {getDashboardSummary,DashboardPeriod} from '../../services/reports/dashboard.service.js'
import {Parser} from 'json2csv'
import {z} from 'zod'
import {
  salesReportQuerySchema,
  inventoryReportQuerySchema,
employeePerformanceQuerySchema,
financialSummaryQuerySchema,
expenseReportQuerySchema,
} from '../../schemas/report.schema.js'



type UserRole = "OWNER" | "EMPLOYEE"; 

interface AuthRequest extends Request {
  user?: {
    id: number;
    role: UserRole; 
    name?: string;  
  };
}


export async function getSalesReportController(req: Request, res: Response) {
  try {
    const query = salesReportQuerySchema.parse(req.query);

    const report = await getSalesReport(query as any);

    
    if (query.format === "csv") {
      const fields = ['saleId', 'createdAt', 'employee.name', 'status', 'itemsTotal', 'paymentsTotal'];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(report.sales);

      res.header("Content-Type", "text/csv");
      res.attachment(`sales-report-${new Date().toISOString().split('T')[0]}.csv`);
      return res.send(csv);
    }

    res.json({
      success: true,
      data: report,
    });

  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err.issues,
      });
    }

    console.error("Report Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to generate sales report",
      error: process.env.NODE_ENV === 'development' ? err.message : "Internal Server Error",
    });
  }
}




export async function getInventoryReportController(req: Request, res: Response) {
  try {
    const query = inventoryReportQuerySchema.parse(req.query);

    const report = await getInventoryReport(query as any);

    if (query.format === "csv") {
      const rows = report.items.map(item => ({
        priceCategoryId: item.priceCategoryId,
        categoryName: item.category.name,
        quantity: item.stock.quantity,
        purchasePrice: item.stock.purchasePrice,
        fixedPrice: item.fixedPrice,
        purchaseValue: item.valuation?.purchaseValue ?? 0,
        fixedValue: item.valuation?.fixedValue ?? 0,
        potentialProfit: item.valuation?.potentialProfit ?? 0,
        lowStock: item.alerts.lowStock,
        highStock: item.alerts.highStock,
        turnoverRate: item.turnover?.rate ?? null,
      }));

      const parser = new Parser();
      const csv = parser.parse(rows);

      res.header("Content-Type", "text/csv");
      res.attachment(
        `inventory-report-${new Date().toISOString().split("T")[0]}.csv`
      );
      return res.send(csv);
    }

    res.json({
      success: true,
      data: report,
    });

  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err.issues,
      });
    }

    console.error("Inventory Report Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to generate inventory report",
      error: process.env.NODE_ENV === "development" ? err.message : "Internal Server Error",
    });
  }
}


export async function getNavbarAlertsController(req: Request, res: Response) {
  try {
    const report = await getInventoryReport({
      lowStockThreshold: 3, 
      limit: 1000,          
      includeValuation: false, 
      includeTurnover: false
    });

    const lowStockItems = report.items.filter(item => item.alerts.lowStock === true);

    res.json({
      success: true,
      count: lowStockItems.length,
      items: lowStockItems
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}


export async function getEmployeePerformanceReportController(req: Request, res: Response) {
  try {
    
    const query = employeePerformanceQuerySchema.parse(req.query);

    const report = await getEmployeePerformanceReport(query as any);

    res.json({
      success: true,
      data: report,
    });

  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err.issues,
      });
    }

    console.error("Employee Performance Report Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to generate employee performance report",
      error: process.env.NODE_ENV === "development" ? err.message : "Internal Server Error",
    });
  }
}



export async function getFinancialSummaryReportController(req: Request, res: Response) {
  try {
    const query = financialSummaryQuerySchema.parse(req.query);

    const report = await getFinancialSummaryReport(query as any);

    res.json({
      success: true,
      data: report,
    });

  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err.issues,
      });
    }

    console.error("Financial Summary Report Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to generate financial summary report",
      error: process.env.NODE_ENV === "development" ? err.message : "Internal Server Error",
    });
  }
}




export async function getExpenseReportController(req: Request, res: Response) {
  try {
   
    const query = expenseReportQuerySchema.parse(req.query);

    const report = await getExpenseReport(query as any);

    if (query.format === "csv") {
      const fields = ['expenseDate', 'category', 'amount', 'description'];
      const parser = new Parser({ fields });
      const csv = parser.parse(report.expenses);

      res.header('Content-Type', 'text/csv');
      res.attachment(`expense-report-${new Date().toISOString().split('T')[0]}.csv`);
      return res.status(200).send(csv);
    }

    if (query.format === "excel") {
      return res.status(501).json({
        success: false,
        message: "Excel format not implemented yet. Use CSV for now.",
      });
    }

    return res.status(200).json({
      success: true,
      data: report,
    });

  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err.issues,
      });
    }

    console.error("Expense report error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to generate expense report",
      error: process.env.NODE_ENV === "development" ? err.message : "Internal Server Error",
    });
  }
}





export async function getDashboardSummaryController(req: AuthRequest, res: Response) {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { period = 'today', full } = req.query;

    const dashboardData = await getDashboardSummary(
      { 
        period: period as DashboardPeriod, 
        full: full as string 
      },
      currentUser.role,
      currentUser.id
    );

    return res.json({
      success: true,
      data: {
        ...dashboardData,
        user: { name: currentUser.name }
      }
    });

  } catch (error: any) {
    console.error("Dashboard Controller Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to load dashboard summary"
    });
  }
}


