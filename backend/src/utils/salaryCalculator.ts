// import prisma from "../prismaClient.js";

// export interface SalaryCalculationResult {
//   workedDays: number;
//   amount: number;
//   breakdown: {
//     date: Date;
//     status: "PRESENT" | "ABSENT" | "HALF_DAY";
//     value: number;
//   }[];
// }

// export async function calculateSalary(
//   userId: number,
//   rate: number,
//   periodStart: Date,
//   periodEnd: Date
// ): Promise<SalaryCalculationResult> {
//   if (rate <= 0) {
//     throw new Error("Rate must be greater than zero");
//   }

//   const attendance = await prisma.attendance.findMany({
//     where: {
//       userId,
//       date: {
//         gte: periodStart,
//         lte: periodEnd,
//       },
//     },
//     orderBy: { date: "asc" },
//   });

//   let workedDays = 0;

//   const breakdown = attendance.map((a) => {
//     let value = 0;

//     if (a.status === "PRESENT") value = 1;
//     if (a.status === "HALF_DAY") value = 0.5;

//     workedDays += value;

//     return {
//       date: a.date,
//       status: a.status,
//       value,
//     };
//   });

//   if (workedDays === 0) {
//     throw new Error("No worked days in this period");
//   }

//   return {
//     workedDays,
//     amount: workedDays * rate,
//     breakdown,
//   };
// }


import prisma from "../prismaClient.js";

export interface SalaryCalculationResult {
  workedDays: number;
  basePay: number;      // Added: to separate attendance pay
  bonusTotal: number;   // Added: to track total bonuses
  amount: number;       // The final sum
  breakdown: {
    date: Date;
    status: "PRESENT" | "ABSENT" | "HALF_DAY";
    value: number;
  }[];
  bonuses: any[];       // Added: list of applied bonuses for the payslip
}

export async function calculateSalary(
  userId: number,
  rate: number,
  periodStart: Date,
  periodEnd: Date
): Promise<SalaryCalculationResult> {
  if (rate <= 0) throw new Error("Rate must be greater than zero");

  // 1. Fetch Attendance (Your existing logic)
  const attendance = await prisma.attendance.findMany({
    where: {
      userId,
      date: { gte: periodStart, lte: periodEnd },
    },
    orderBy: { date: "asc" },
  });

  // 2. NEW: Fetch any applied BonusPayments for this user in this period
  const appliedBonuses = await prisma.bonusPayment.findMany({
    where: {
      userId,
      periodStart: { gte: periodStart },
      periodEnd: { lte: periodEnd }
    }
  });

  let workedDays = 0;
  const breakdown = attendance.map((a) => {
    let value = 0;
    if (a.status === "PRESENT") value = 1;
    if (a.status === "HALF_DAY") value = 0.5;
    workedDays += value;
    return { date: a.date, status: a.status as any, value };
  });

  if (workedDays === 0 && appliedBonuses.length === 0) {
    throw new Error("No worked days or bonuses found for this period");
  }

  const basePay = workedDays * rate;
  const bonusTotal = appliedBonuses.reduce((sum, b) => sum + b.amount, 0);

  return {
    workedDays,
    basePay,
    bonusTotal,
    amount: basePay + bonusTotal,
    breakdown,
    bonuses: appliedBonuses, 
  };
}
