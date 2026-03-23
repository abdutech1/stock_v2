import prisma from "../../prismaClient.js";
import { startOfDay, endOfDay, startOfWeek, startOfMonth } from "date-fns";

export interface EmployeePerformanceQuery {
  userId?: number;
  startDate?: string | Date;
  endDate?: string | Date;
  period?: 'today' | 'thisWeek' | 'thisMonth';
}



export async function getEmployeePerformanceReport(query: { period?: string } = {}) {
  const { period = 'today' } = query;
  const now = new Date();
  let start: Date;
  let end = endOfDay(now);

  if (period === 'thisWeek') start = startOfWeek(now, { weekStartsOn: 1 });
  else if (period === 'thisMonth') start = startOfMonth(now);
  else start = startOfDay(now);

  const employees = await prisma.user.findMany({
    where: { role: "EMPLOYEE", isActive: true },
    select: {
      id: true,
      name: true,
      sale: { 
        where: {
          createdAt: { gte: start, lte: end },
        },
        select: {
          items: { select: { soldPrice: true, quantity: true } }
        }
      }
    }
  });

  const enriched = employees.map(emp => {
    let totalRevenue = 0;
    emp.sale.forEach(s => {
      s.items.forEach(item => {
        totalRevenue += (item.soldPrice * item.quantity);
      });
    });

    return {
      id: emp.id,
      name: emp.name,
      totalRevenue,
      salesCount: emp.sale.length
    };
  });

  enriched.sort((a, b) => b.totalRevenue - a.totalRevenue);

  return enriched.map((emp, index) => ({
    ...emp,
    rank: index + 1
  }));
}