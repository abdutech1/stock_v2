import prisma from "../prismaClient.js";

type CreateExpenseInput = {
  description: string;
  amount: number;
  expenseDate?: Date;
  category?: string;
};

export async function createExpense(data: CreateExpenseInput) {
  if (!data.description || data.description.trim() === "") {
    throw new Error("Description is required");
  }

  if (data.amount <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  function normalizeDate(date: Date) {
  date.setHours(0, 0, 0, 0);
  return date;
}


  const expenseDate = normalizeDate(data.expenseDate ?? new Date());


  if (isNaN(expenseDate.getTime())) {
    throw new Error("Invalid expense date");
  }

  return prisma.expense.create({
    data: {
      ...data,
      expenseDate,
    },
  });
}


// export async function getExpenses(startDate?: Date, endDate?: Date) {
//   const where: any = {};

//   if (startDate && endDate) {
//     if (startDate > endDate) {
//       throw new Error("startDate cannot be after endDate");
//     }

//     where.expenseDate = {
//       gte: startDate,
//       lte: endDate,
//     };
//   }

//   const [expenses, aggregate] = await prisma.$transaction([
//     prisma.expense.findMany({
//       where,
//       orderBy: { expenseDate: "desc" },
//     }),
//     prisma.expense.aggregate({
//       where,
//       _sum: { amount: true },
//       _count: { _all: true },
//     }),
//   ]);

//   return {
//     summary: {
//       totalAmount: aggregate._sum.amount ?? 0,
//       count: aggregate._count._all,
//     },
//     data: expenses,
//   };
// }

// backend/services/expense.service.ts

export async function getExpenses(startDate?: Date, endDate?: Date) {
  const where: any = {};

  if (startDate && endDate) {
    // Force Start Date to very beginning of the day
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    // Force End Date to the very end of the day
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    where.expenseDate = {
      gte: start,
      lte: end,
    };
  }

  const [expenses, aggregate] = await prisma.$transaction([
    prisma.expense.findMany({
      where,
      orderBy: { expenseDate: "desc" },
    }),
    prisma.expense.aggregate({
      where,
      _sum: { amount: true },
      _count: { _all: true },
    }),
  ]);

  return {
    summary: {
      totalAmount: aggregate._sum.amount ?? 0,
      count: aggregate._count._all,
    },
    data: expenses,
  };
}


export async function updateExpense(
  id: number,
  data: Partial<CreateExpenseInput>
) {
  const existing = await prisma.expense.findUnique({ where: { id } });

  if (!existing) {
    throw new Error("Expense not found");
  }

  if (data.amount !== undefined && data.amount <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  if (data.expenseDate && isNaN(data.expenseDate.getTime())) {
    throw new Error("Invalid expense date");
  }

  return prisma.expense.update({
    where: { id },
    data,
  });
}

export async function deleteExpense(id: number) {
  const existing = await prisma.expense.findUnique({ where: { id } });

  if (!existing) {
    throw new Error("Expense not found");
  }

  return prisma.expense.delete({ where: { id } });
}


