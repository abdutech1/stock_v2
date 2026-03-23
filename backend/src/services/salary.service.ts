import prisma from "../prismaClient.js";
import { calculateSalary } from "../utils/salaryCalculator.js";



interface CreateSalaryPaymentInput {
  userId: number;
  rate: number;
  periodStart: Date;
  periodEnd: Date;
}

export async function createSalaryPayment({
  userId,
  rate,
  periodStart,
  periodEnd,
}: CreateSalaryPaymentInput) {
  if (periodStart > periodEnd) {
    throw new Error("Invalid salary period");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");
  if (user.role === "OWNER") {
    throw new Error("Cannot pay salary to owner");
  }

  // 🚫 Prevent overlapping salary payments
  const overlap = await prisma.salarypayment.findFirst({
    where: {
      userId,
      AND: [
        { periodStart: { lte: periodEnd } },
        { periodEnd: { gte: periodStart } },
      ],
    },
  });

  if (overlap) {
    throw new Error(
      `Salary already paid for overlapping period (${overlap.periodStart.toDateString()} - ${overlap.periodEnd.toDateString()})`
    );
  }

  // ✅ Shared calculation
  const calculation = await calculateSalary(
    userId,
    rate,
    periodStart,
    periodEnd
  );

  return prisma.salarypayment.create({
    data: {
      userId,
      rate,
      daysWorked: calculation.workedDays,
      amount: calculation.amount,
      paymentType:
        periodStart.getTime() === periodEnd.getTime()
          ? "DAILY"
          : "PERIOD",
      periodStart,
      periodEnd,
    },
  });
}



export async function getAllSalaries() {
  return prisma.salarypayment.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
}





export interface SalaryReportInput {
  weekStart?: Date;
  weekEnd?: Date;
}



export async function generateSalaryReport(
  periodStart?: Date,
  periodEnd?: Date
) {
  const where: any = {};
  if (periodStart) where.periodEnd = { gte: periodStart };
  if (periodEnd) where.periodStart = { lte: periodEnd };

  return prisma.salarypayment.findMany({
    where,
    include: { user: true },
    orderBy: { periodStart: "desc" },
  });
}



export async function updateSalaryPayment(id: number, updateData: Partial<CreateSalaryPaymentInput>) {
  // 1. Find existing record
  const existing = await prisma.salarypayment.findUnique({ where: { id } });
  if (!existing) throw new Error("Salary record not found");

  // 2. Merge data to check for overlaps/calculations
  const finalUserId = updateData.userId ?? existing.userId;
  const finalRate = updateData.rate ?? existing.rate;
  const finalStart = updateData.periodStart ?? existing.periodStart;
  const finalEnd = updateData.periodEnd ?? existing.periodEnd;

  // 3. Prevent overlapping (excluding current record ID)
  const overlap = await prisma.salarypayment.findFirst({
    where: {
      userId: finalUserId,
      id: { not: id }, // Important: Don't collide with yourself
      AND: [
        { periodStart: { lte: finalEnd } },
        { periodEnd: { gte: finalStart } },
      ],
    },
  });

  if (overlap) throw new Error("Update failed: Overlapping salary period found.");

  // 4. Re-calculate
  const calculation = await calculateSalary(finalUserId, finalRate, finalStart, finalEnd);

  return prisma.salarypayment.update({
    where: { id },
    data: {
      userId: finalUserId,
      rate: finalRate,
      periodStart: finalStart,
      periodEnd: finalEnd,
      daysWorked: calculation.workedDays,
      amount: calculation.amount,
      paymentType: finalStart.getTime() === finalEnd.getTime() ? "DAILY" : "PERIOD",
    },
  });
}

export async function deleteSalaryPayment(id: number) {
  const existing = await prisma.salarypayment.findUnique({ where: { id } });
  if (!existing) throw new Error("Salary record not found");
  
  return prisma.salarypayment.delete({ where: { id } });
}