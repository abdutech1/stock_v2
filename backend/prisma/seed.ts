import { PrismaClient, UserRole, BranchRole, Plan, SaleStatus, PaymentMethod, StockLogType, TransferStatus, PriceType, PurchaseStatus } from '@prisma/client'

// const prisma = new PrismaClient()
import prisma from "../src/prismaClient.js";

async function main() {
  console.log('🌱 Starting database seeding...')

  // 1. Create a Super Admin Organization (for system-level access)
  const superOrg = await prisma.organization.upsert({
    where: { slug: 'super-admin' },
    update: {},
    create: {
      name: 'Super Admin Organization',
      slug: 'super-admin',
      plan: Plan.ENTERPRISE,
      settings: {
        currency: 'ETB',
        timezone: 'Africa/Addis_Ababa',
        taxRate: 15
      }
    }
  })

  // 2. Create Default Super Admin User
  const superAdmin = await prisma.user.upsert({
    where: { phoneNumber: '+251911000001' },
    update: {},
    create: {
      name: 'System Super Admin',
      phoneNumber: '+251911000001',
      password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
      role: UserRole.SUPER_ADMIN,
      organizationId: superOrg.id,
      isActive: true
    }
  })

  // 3. Create a Sample Organization (This is what normal tenants will get)
  const org = await prisma.organization.upsert({
    where: { slug: 'demo-company' },
    update: {},
    create: {
      name: 'Demo Trading PLC',
      slug: 'demo-company',
      plan: Plan.PRO,
      settings: {
        currency: 'ETB',
        timezone: 'Africa/Addis_Ababa',
        taxRate: 15
      }
    }
  })

  // 4. Create Default Branch for the sample organization
  const mainBranch = await prisma.branch.upsert({
    where: { 
      organizationId_name: {
        organizationId: org.id,
        name: 'Main Branch'
      }
    },
    update: {},
    create: {
      name: 'Main Branch',
      organizationId: org.id
    }
  })

  // 5. Create ORG_ADMIN user for the sample organization
  const orgAdmin = await prisma.user.upsert({
    where: { phoneNumber: '+251911000002' },
    update: {},
    create: {
      name: 'Demo Admin',
      phoneNumber: '+251911000002',
      password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
      role: UserRole.ORG_ADMIN,
      organizationId: org.id,
      isActive: true
    }
  })

  // 6. Link ORG_ADMIN to the branch
  await prisma.branchUser.upsert({
    where: {
      userId_branchId: {
        userId: orgAdmin.id,
        branchId: mainBranch.id
      }
    },
    update: {},
    create: {
      userId: orgAdmin.id,
      branchId: mainBranch.id,
      role: BranchRole.MANAGER
    }
  })

  // 7. Create a sample Employee
  const employee = await prisma.user.upsert({
    where: { phoneNumber: '+251911000003' },
    update: {},
    create: {
      name: 'Abebe Kebede',
      phoneNumber: '+251911000003',
      password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
      role: UserRole.EMPLOYEE,
      organizationId: org.id,
      isActive: true
    }
  })

  await prisma.branchUser.create({
    data: {
      userId: employee.id,
      branchId: mainBranch.id,
      role: BranchRole.CASHIER
    }
  })

  console.log('✅ Seeding completed successfully!')
  console.log(`   Super Admin Phone : +251911000001`)
  console.log(`   Demo Org Admin    : +251911000002 (password: "password")`)
  console.log(`   Demo Employee     : +251911000003 (password: "password")`)
  console.log(`   Organization Slug : demo-company`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })