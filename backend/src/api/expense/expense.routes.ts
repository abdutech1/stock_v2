import { Router } from "express";
import {
  addExpense,
  listExpenses,
  editExpense,
  removeExpense,
} from "./expense.controller.js";

import { validate } from "../../middleware/validate.js";
import {
  createExpenseSchema,
  updateExpenseSchema,
  listExpensesQuerySchema,
  expenseIdParamSchema,
} from "../../schemas/expense.schema.js";

const router = Router();

router.post(
  "/",
  validate(createExpenseSchema),
  addExpense
);

router.get(
  "/",
  validate(listExpensesQuerySchema, "query"),
  listExpenses
);

router.put(
  "/:id",
  validate(expenseIdParamSchema, "params"),
  validate(updateExpenseSchema),
  editExpense
);

router.delete(
  "/:id",
  validate(expenseIdParamSchema, "params"),
  removeExpense
);

export default router;


