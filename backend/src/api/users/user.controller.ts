import { Request, Response } from "express";
import { AppError } from "@/utils/AppError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import * as userService from "../../services/user.service.js";

export const createEmployeeController = catchAsync(async (req: Request, res: Response) => {
  const { name, phoneNumber, branchRole, branchId,baseSalary } = req.body;
  const organizationId = req.user!.organizationId; // Using ! if your middleware guarantees req.user

  const employee = await userService.createEmployee({ 
    name, phoneNumber, branchRole, branchId, organizationId,baseSalary: Number(baseSalary)
  });

  res.status(201).json({ status: "success", data: employee });
});



export const getEmployeesController = catchAsync(async (req: Request, res: Response) => {
  const organizationId = req.user!.organizationId;
  
  // Get branchId from query parameters
  const branchId = req.query.branchId ? Number(req.query.branchId) : undefined;

  const employees = await userService.getEmployees(organizationId, branchId);
  
  res.json({ 
    status: "success", 
    results: employees.length, 
    data: employees 
  });
});

export const getEmployeeController = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const organizationId = req.user!.organizationId;
  const employee = await userService.getEmployeeById(id, organizationId);
  res.json({ status: "success", data: employee });
});

export const updateEmployeeController = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const organizationId = req.user!.organizationId;
  const employee = await userService.updateEmployee(id, organizationId, req.body);
  res.json({ status: "success", data: employee });
});

export const deactivateEmployeeController = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const organizationId = req.user!.organizationId;
  const currentUserId = req.user!.id;

  const employee = await userService.deactivateEmployee(id, organizationId, currentUserId);
  res.json({ status: "success", message: "Employee deactivated", data: employee });
});

export const activateEmployeeController = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const organizationId = req.user!.organizationId;
  const employee = await userService.activateEmployee(id, organizationId);
  res.json({ status: "success", message: "Employee activated", data: employee });
});

export const getDeactivatedEmployeesController = catchAsync(async (req: Request, res: Response) => {
  const organizationId = req.user!.organizationId;
  const employees = await userService.getDeactivatedEmployees(organizationId);
  res.json({ status: "success", data: employees });
});

export const transferEmployeeController = catchAsync(async (req: Request, res: Response) => {
  const employeeId = Number(req.params.id);
  const { newBranchId, newRole } = req.body;
  const organizationId = req.user!.organizationId;

  if (!newBranchId || !newRole) throw new AppError("New branch ID and Role are required", 400);

  const result = await userService.transferEmployee(employeeId, organizationId, Number(newBranchId), newRole);
  res.status(200).json({ status: "success", message: "Transfer successful", data: result });
});