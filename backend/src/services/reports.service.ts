import prisma from "@/prismaClient.js";
import { AppError } from "@/utils/AppError.js";

export async function getOrgGlobalOverview(organizationId: number) {
  // 1. Fetch Organization-wide totals and the detailed branch list in parallel
  const [orgData, branches, revenueStats] = await Promise.all([
    // Get high-level counts
    prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        _count: {
          select: {
            branches: true,
            users: true,
            products: true,
          },
        },
      },
    }),

    prisma.branch.findMany({
      where: { 
        organizationId, 
        deletedAt: null 
      },
      include: {
        _count: {
          select: { 
            branchUsers: true,
            stocks: true,
            sales: true 
          }
        }
      }
    }),

    // Aggregate Revenue
    prisma.sale.aggregate({
      where: { 
        branch: { organizationId } 
      },
      _sum: {
        totalAmount: true
      }
    })
  ]);

  if (!orgData) throw new AppError("Organization not found", 404);

  // 2. Format the response
  return {
    // Global Stats (from orgData._count)
    totalBranches: orgData._count.branches,
    totalEmployees: orgData._count.users, // Includes all users in the org
    totalProducts: orgData._count.products,
    totalRevenue: Number(revenueStats._sum.totalAmount) || 0,

    // Detailed Branch List
    branches: branches.map((b) => ({
      id: b.id,
      name: b.name,
      employeeCount: b._count.branchUsers,
      stockItemsCount: b._count.stocks,
      salesCount: b._count.sales,
      status: b.isActive ? "ACTIVE" : "INACTIVE",
    })),
  };
}