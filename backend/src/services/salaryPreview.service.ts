import prisma from "../prismaClient.js";
import { calculateSalary } from "../utils/salaryCalculator.js";

interface SalaryPreviewInput {
  userId: number;
  rate: number;
  periodStart: Date;
  periodEnd: Date;
}

export async function previewSalary({
  userId,
  rate,
  periodStart,
  periodEnd,
}: SalaryPreviewInput) {
  if (periodStart > periodEnd) {
    throw new Error("Invalid salary period");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");
  if (user.role === "OWNER") {
    throw new Error("Owner does not receive salary");
  }

  // 🚫 Check overlapping paid periods
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
    return {
      canPay: false,
      reason: `Salary already paid for ${overlap.periodStart.toDateString()} - ${overlap.periodEnd.toDateString()}`,
    };
  }

  // ✅ Calculate salary (shared logic)

  try {
    const calculation = await calculateSalary(
      userId,
      rate,
      periodStart,
      periodEnd,
    );

    return {
      canPay: true,
      employee: {
        id: user.id,
        name: user.name,
      },
      periodStart,
      periodEnd,
      rate,
      workedDays: calculation.workedDays,
      totalAmount: calculation.amount,
      breakdown: calculation.breakdown,
    };
  } catch (error: any) {
    {
      if (error.message === "No worked days in this period") {
        return {
          canPay: false,
          reason: "The employee has no recorded attendance for this period.",
        };
      }
      throw error;
    }
  }
}
