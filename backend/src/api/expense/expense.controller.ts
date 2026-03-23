import { Request, Response } from "express";
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from "../../services/expense.service.js";

export async function addExpense(req: Request, res: Response) {
  try {
    const { description, amount, expenseDate, category } = req.body;

    const expense = await createExpense({
      description,
      amount,
      category,
      expenseDate: expenseDate ? new Date(expenseDate) : undefined,
    });

    res.status(201).json(expense);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function listExpenses(req: Request, res: Response) {
  try {
    const { startDate, endDate } = req.query;

    const result = await getExpenses(
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function editExpense(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const expense = await updateExpense(id, {
      ...req.body,
      expenseDate: req.body.expenseDate
        ? new Date(req.body.expenseDate)
        : undefined,
    });

    res.json(expense);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function removeExpense(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    await deleteExpense(id);

    res.json({ message: "Expense deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
