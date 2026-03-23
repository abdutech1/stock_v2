import { Request, Response } from "express";
import { z } from "zod";
import { 
  createSalaryPayment, 
  getAllSalaries, 
  generateSalaryReport,
  updateSalaryPayment, 
  deleteSalaryPayment 
} from "../../services/salary.service.js";
import { createSalarySchema, 
  salaryReportQuerySchema,
updateSalarySchema, 
  salaryIdParamSchema  } from "../../schemas/salary.schema.js";

export async function paySalary(req: Request, res: Response) {
  try {
    const validatedData = createSalarySchema.parse(req.body);

    const salary = await createSalaryPayment(validatedData);
    res.status(201).json(salary);
  } catch (error: any) {
    handleError(res, error);
  }
}

export async function getSalaries(req: Request, res: Response) {
  try {
    res.json(await getAllSalaries());
  } catch (error: any) {
    handleError(res, error);
  }
}

export async function getSalaryReport(req: Request, res: Response) {
  try {
    const query = salaryReportQuerySchema.parse(req.query);

    const report = await generateSalaryReport(query.periodStart, query.periodEnd);
    res.json(report);
  } catch (error: any) {
    handleError(res, error);
  }
}

function handleError(res: Response, error: any) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({ success: false, errors: error.issues });
  }
  res.status(500).json({ message: error.message || "Internal server error" });
}




export async function updateSalary(req: Request, res: Response) {
  try {
    const { id } = salaryIdParamSchema.parse(req.params);
    const validatedData = updateSalarySchema.parse(req.body);

    const updated = await updateSalaryPayment(id, validatedData);
    res.json(updated);
  } catch (error: any) {
    handleError(res, error);
  }
}

export async function deleteSalary(req: Request, res: Response) {
  try {
    const { id } = salaryIdParamSchema.parse(req.params);
    
    await deleteSalaryPayment(id);
    
    res.status(200).json({ 
      success: true,
      message: `Salary payment with ID ${id} has been successfully deleted.` 
    });
  } catch (error: any) {
    handleError(res, error);
  }
}