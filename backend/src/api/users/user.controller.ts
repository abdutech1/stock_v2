import { Request, Response } from "express";
import { AppError } from "@/utils/AppError.js";
import {
  createEmployee,
  updateEmployee,
  deactivateEmployee,
  getEmployees,
  getEmployeeById,
  activateEmployee,
  getDeactivatedEmployees
} from "../../services/user.service.js";

import { catchAsync } from "../../utils/catchAsync.js";
import * as userService from "../../services/user.service.js";



export const createEmployeeController = catchAsync(async (req: Request, res: Response) => {
  const { name, phoneNumber, branchRole, branchId } = req.body;
  const organizationId = (req as any).user.organizationId;

  const employee = await userService.createEmployee({ 
    name, phoneNumber, branchRole, branchId, organizationId 
  });

  res.status(201).json({ status: "success", data: employee });
});


export const getEmployeesController = catchAsync(async (req: Request, res: Response) => {
  const organizationId = (req as any).user.organizationId;
  const employees = await userService.getEmployees(organizationId);
  
  res.json({ status: "success", results: employees.length, data: employees });
});


export  const  updateEmployeeController = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
    const organizationId = (req as any).user.organizationId;
    const updates = req.body;

    const employee = await updateEmployee(id, organizationId, updates);
    res.json({ status: "success", data: employee });
})


export const  deactivateEmployeeController = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
    const organizationId = (req as any).user.organizationId;
    const currentUserId = (req as any).user.id; 

    const employee = await deactivateEmployee(id, organizationId, currentUserId);
    
    res.json({ status: "success", message: "Employee deactivated", data: employee });
})


export const  getEmployeeController = catchAsync(async (req: Request, res: Response) => {
      const id = Number(req.params.id);
      const organizationId = (req as any).user.organizationId;
      const employee = await getEmployeeById(id, organizationId);
      res.json({ status: "success", data: employee });
})

 export const  activateEmployeeController = catchAsync(async(req: Request, res: Response) => {
  const id = Number(req.params.id);
    const organizationId = (req as any).user.organizationId;
    const employee = await activateEmployee(id, organizationId);
    res.json({
      status: "success",
      message: "Employee activated",
      data: employee,
    });
 })

export const getDeactivatedEmployeesController = catchAsync(async (req: Request, res: Response) => {
    const organizationId = (req as any).user.organizationId;
    const employees = await getDeactivatedEmployees(organizationId);
    res.json({ 
      status: "success", 
      data: employees 
    });
})



export const transferEmployeeController = catchAsync(async (req: Request, res: Response) => {
  const employeeId = Number(req.params.id);
  const { newBranchId } = req.body;
  const organizationId = (req as any).user.organizationId;

  if (!newBranchId) throw new AppError("New branch ID is required", 400);

  await userService.transferEmployee(employeeId, organizationId, Number(newBranchId));

  res.status(200).json({
    status: "success",
    message: "Employee transferred to new branch successfully"
  });
});