import prisma from '../../prismaClient.js'
import { getFinancialSummaryReport } from './finincial.service.js';
import {  
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  startOfMonth, 
  startOfYear } from "date-fns";


export type DashboardPeriod =
  | 'today'
  | 'thisWeek'
  | 'thisMonth'
  | 'thisYear'
  | 'custom';

export interface DashboardSummaryQuery {
  period?: DashboardPeriod;
  startDate?: string;
  endDate?: string;
  lowStockThreshold?: number;
  full?: string;
}


function resolveDashboardPeriod(query: DashboardSummaryQuery) {
  const now = new Date();
  const period = query.period ?? 'thisMonth';

  let start: Date;
  let end: Date = endOfDay(now);

  switch (period) {
    case 'today':
      start = startOfDay(now);
      break;

    case 'thisWeek':
      start = startOfWeek(now, { weekStartsOn: 1 });
      break;

    case 'thisMonth':
      start = startOfMonth(now);
      break;

    case 'thisYear':
      start = startOfYear(now);
      break;

    case 'custom':
      if (!query.startDate || !query.endDate) {
        throw new Error('Custom period requires startDate and endDate');
      }
      start = startOfDay(new Date(query.startDate));
      end = endOfDay(new Date(query.endDate));
      break;

    default:
      start = startOfMonth(now);
  }

  return { period, start, end };
}



export async function getDashboardSummary(query: DashboardSummaryQuery = {}, userRole: string, userId: number) {
  const { period, start, end } = resolveDashboardPeriod(query);
  const isOwner = userRole === 'OWNER';

  const isFullHistory = query.full === 'true';

  const [salesData, inventory, recentExpenses] = await Promise.all([
   
    getSalesMetrics(start, end, isOwner ? undefined : userId, isFullHistory ? undefined : 10),
    getInventoryMetrics(query.lowStockThreshold, isOwner),
    isOwner ? getRecentExpenses(true) : Promise.resolve([])
  ]);

  let secondaryMetrics = null;
  let financial = null;

  if (isOwner) {
    [secondaryMetrics, financial] = await Promise.all([
      getEmployeeMetrics(start, end),
      getFinancialMetrics(start, end, salesData.totalRevenue, salesData.totalCost)
    ]);

    const fullFinancial = await getFinancialSummaryReport({
      startDate: start,
      endDate: end,
      includeSalaries: true,
      includeBonuses: true,
      includeExpenses: false 
    });


    const revenue = salesData.totalRevenue ?? 0;
const cogs = salesData.totalCost ?? 0;
const expenses = financial.expenses ?? 0;
const payroll = fullFinancial.summary.totalPayroll ?? 0;

const calculatedNetProfit = revenue - cogs - expenses - payroll;
    

    financial = {
  ...financial,
  totalPayroll: payroll,
  netProfit: calculatedNetProfit,
  grossProfit: revenue - cogs 
};
  } else {
    secondaryMetrics = await getEmployeePersonalStats(start, end, userId);
  }

  const ownerMetrics = isOwner ? (secondaryMetrics as any) : null;
const employeeMetrics = !isOwner ? (secondaryMetrics as any) : null;

  return {
    period: {
      label: period === 'custom' ? 'Custom' : period.replace('this', 'This '),
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    },
    sales: {
      totalRevenue: salesData.totalRevenue ?? 0,
      salesCount: salesData.salesCount ?? 0,
      averageSaleValue: Number(salesData.averageSaleValue ?? 0).toFixed(2),
      paymentBreakdown: salesData.paymentBreakdown ?? {},
      topContributor: salesData.topContributor.name, // String for the UI card
    },
    recentSales: salesData.rawSales.map(sale => {
      const calculatedTotal = sale.items.reduce((sum: number, item: any) => 
        sum + (Number(item.quantity) || 0) * (Number(item.soldPrice) || 0), 0
      );

      return {
        saleId: sale.id,
        createdAt: sale.createdAt,
        status: sale.status,
        itemsTotal: calculatedTotal,
        employeeName: sale.user?.name || "Unknown",
        items: sale.items.map((i: any) => ({
          categoryName: i.pricecategory?.category?.name || "Item",
          quantity: i.quantity
        })),
        payments: sale.payments.map((p: any) => ({
          method: p.method,
          amount: p.amount,
          bankName: p.bankName
        }))
      };
    }),
    inventory: {
      totalValue: inventory.totalValue ?? 0,
      lowStockItems: inventory.lowStockItems ?? 0,
      outOfStockItems: inventory.outOfStockItems ?? 0,
    },
    employees: {
     averageAttendanceRate: isOwner 
       ? (Number(ownerMetrics?.averageAttendanceRate ?? 0).toFixed(1) + '%')
       : (Number(employeeMetrics?.personalAttendance ?? 0).toFixed(1) + '%'),
  },
  // stats: {
  //     totalTeamMembers: isOwner ? (secondaryMetrics as any)?.count : (secondaryMetrics as any)?.totalTeamMembers,
  //   },
  stats: {
    rank: isOwner ? "Owner" : (secondaryMetrics as any)?.rank || "--",
    totalTeamMembers: isOwner ? (secondaryMetrics as any)?.count : (secondaryMetrics as any)?.totalTeamMembers,
  },
    financial: financial ? {
      ...financial,
      totalPayroll: financial.totalPayroll ?? 0, // NEW field for the UI
      profitMargin: typeof financial.profitMargin === 'number'
        ? (financial.profitMargin.toFixed(1) + '%')
        : '0.0%',
    } : null,
    recentExpenses: recentExpenses ?? [],
  };
}


async function getSalesMetrics(start: Date, end: Date, userId?: number,limit?: number) {
  const whereClause: any = {
    status: { in: ['CONFIRMED', 'DRAFT'] },
    createdAt: { gte: start, lte: end },
  };

  if (userId) whereClause.employeeId = userId;

  const sales = await prisma.sale.findMany({
    where: whereClause,
    include: {
      user: { select: { name: true } },
      items: {
        include: {
          pricecategory: { 
            include: { 
              category: true, 
              stock: true 
            } 
          }
        }
      },
      payments: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  let totalRevenue = 0;
  let totalCost = 0;
  const paymentBreakdown: Record<string, number> = {};
  const categoryRevenue: Record<string, number> = {};

  for (const sale of sales) {
    let saleRevenue = 0;
    
    for (const item of sale.items) {
      const itemRev = (Number(item.quantity) || 0) * (Number(item.soldPrice) || 0);
      saleRevenue += itemRev;

      const catName = item.pricecategory?.category?.name || "Other";
      categoryRevenue[catName] = (categoryRevenue[catName] ?? 0) + itemRev;

      if (!userId) {
        totalCost += (Number(item.quantity) || 0) * (Number(item.pricecategory?.stock?.purchasePrice) || 0);
      }
    }

    totalRevenue += saleRevenue;

    if (sale.payments && sale.payments.length > 0) {
      for (const payment of sale.payments) {
        const method = payment.method?.toUpperCase();
        const displayName = method === 'BANK' ? 'Digital' : method === 'CASH' ? 'Cash' : 'Other';

        paymentBreakdown[displayName] = (paymentBreakdown[displayName] ?? 0) + (Number(payment.amount) || 0);
      }
    } 
    else if (saleRevenue > 0) {
      paymentBreakdown["Cash"] = (paymentBreakdown["Cash"] ?? 0) + saleRevenue;
    }
  }

  const topContributor = Object.entries(categoryRevenue).reduce(
    (max, [name, revenue]) => (revenue > max.revenue ? { name, revenue } : max),
    { name: "N/A", revenue: 0 }
  );

  return {
    totalRevenue,
    totalCost,
    salesCount: sales.length,
    averageSaleValue: sales.length > 0 ? totalRevenue / sales.length : 0,
    paymentBreakdown, 
    topContributor,
    // rawSales: sales.slice(0, 10),
    rawSales: limit ? sales.slice(0, limit) : sales,
  };
}


async function getEmployeePersonalStats(start: Date, end: Date, userId: number) {
  const totalStaff = await prisma.user.count({ 
    where: { role: 'EMPLOYEE', isActive: true } 
  });

  const sales = await prisma.sale.findMany({
    where: { 
      status: { in: ['CONFIRMED', 'DRAFT'] }, 
      createdAt: { gte: start, lte: end } 
    },
    select: {
      employeeId: true,
      items: {
        select: {
          quantity: true,
          soldPrice: true
        }
      }
    }
  });

  const revenueMap: Record<number, number> = {};

  sales.forEach(sale => {
    const saleTotal = sale.items.reduce((sum, item) => 
      sum + (Number(item.quantity) * Number(item.soldPrice)), 0
    );
    
    revenueMap[sale.employeeId] = (revenueMap[sale.employeeId] || 0) + saleTotal;
  });

  const rankings = Object.entries(revenueMap)
    .map(([empId, revenue]) => ({ empId: Number(empId), revenue }))
    .sort((a, b) => b.revenue - a.revenue);

  const myIndex = rankings.findIndex(r => r.empId === userId);
  
  const rank = myIndex === -1 ? totalStaff : myIndex + 1;

  const personalAttendance = await prisma.attendance.findMany({
    where: {
      userId: userId,
      date: { gte: start, lte: end }
    }
  });

  const totalDays = personalAttendance.length;
  const presentDays = personalAttendance.filter(a => 
    a.status === 'PRESENT' || a.status === 'HALF_DAY'
  ).length;

  const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

  return {
    rank,
    totalTeamMembers: totalStaff,
    personalAttendance: attendanceRate, 
    topPerformer: null 
  };
}


async function getInventoryMetrics(threshold = 3, isOwner = false) {
  const stocks = await prisma.stock.findMany({
    select: { quantity: true, purchasePrice: isOwner },
  });

  let totalValue = 0;
  let low = 0;
  let out = 0;

  stocks.forEach(s => {
    if (isOwner) totalValue += s.quantity * (s.purchasePrice ?? 0);
    if (s.quantity === 0) out++;
    else if (s.quantity < threshold) low++;
  });

  return {
    totalValue: isOwner ? totalValue : undefined,
    lowStockItems: low,
    outOfStockItems: out,
  };
}

async function getRecentExpenses(isOwner: boolean) {
  if (!isOwner) return [];
  
  const items = await prisma.expense.findMany({ 
    orderBy: { expenseDate: 'desc' }, 
    take: 5 
  });

  return items.map(e => ({
    description: e.description,
    amount: e.amount,
    category: e.category ?? 'Other',
    date: e.expenseDate.toISOString().split('T')[0],
  }));
}


async function getEmployeeMetrics(start: Date, end: Date) {
  const employees = await prisma.user.findMany({
    where: { 
      role: 'EMPLOYEE', 
      isActive: true 
    },
    include: {
      sale: {
        where: { 
          status: { in: ['CONFIRMED', 'DRAFT'] }, 
          createdAt: { gte: start, lte: end } 
        },
        include: { items: true },
      },
      attendance: {
        where: { 
          date: { gte: start, lte: end } 
        },
      },
    },
  });

  let topPerformer: { name: string; revenue: number } = { name: "N/A", revenue: 0 };
  let totalAttendanceRateSum = 0;

  for (const emp of employees) {
    const revenue = (emp.sale || []).reduce(
      (sum, s) =>
        sum + (s.items || []).reduce((a, i) => a + (i.quantity ?? 0) * (i.soldPrice ?? 0), 0),
      0
    );

    if (revenue > topPerformer.revenue) {
      topPerformer = { name: emp.name || "Unknown", revenue };
    }

    const totalRecords = emp.attendance?.length || 0;
    const presentRecords = (emp.attendance || []).filter(a =>
      a.status === 'PRESENT' || a.status === 'HALF_DAY'
    ).length;

    const individualRate = totalRecords > 0 ? presentRecords / totalRecords : 0;
    totalAttendanceRateSum += individualRate;
  }

  return {
    count: employees.length,
    topPerformer: employees.length > 0 ? topPerformer : null,
    averageAttendanceRate: employees.length > 0
        ? (totalAttendanceRateSum / employees.length) * 100
        : 0,
  };
}


async function getFinancialMetrics(start: Date, end: Date, revenue: number, cost: number) {
  const [expenses, salaries, bonuses] = await Promise.all([
    prisma.expense.aggregate({
      where: { expenseDate: { gte: start, lte: end } },
      _sum: { amount: true },
    }),
    prisma.salarypayment.aggregate({
      where: { periodStart: { gte: start }, periodEnd: { lte: end } },
      _sum: { amount: true },
    }),
    prisma.bonusPayment.aggregate({
      where: { periodStart: { gte: start }, periodEnd: { lte: end } },
      _sum: { amount: true },
    }),
  ]);

  const totalExpenses = expenses._sum.amount ?? 0;
  const totalPayroll =
    (salaries._sum.amount ?? 0) + (bonuses._sum.amount ?? 0);

  const grossProfit = revenue - cost;
  const netProfit = grossProfit - totalExpenses - totalPayroll;

  return {
    revenue,
    expenses: totalExpenses,
    payroll: totalPayroll,
    grossProfit,
    netProfit,
    profitMargin: revenue > 0 ? (netProfit / revenue) * 100 : null,
  };
}