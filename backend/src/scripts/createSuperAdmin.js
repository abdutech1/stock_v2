import bcrypt from "bcrypt";
import { UserRole, Plan } from "@prisma/client";
import prisma from '../prismaClient.js';

async function createSuperAdmin() {
  const name = "System Admin";
  const phoneNumber = "0932121559";
  const password = "!abduFirst@2026";
  const orgSlug = "system-admin";

  console.log("🚀 Initializing Super Admin creation...");

  try {
    const org = await prisma.organization.upsert({
      where: { slug: orgSlug },
      update: {},
      create: {
        name: "System Management",
        slug: orgSlug,
        plan: Plan.ENTERPRISE,
      },
    });

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create/Update the Super Admin User
    const user = await prisma.user.upsert({
      where: { phoneNumber },
      update: {
        role: UserRole.SUPER_ADMIN,
        isActive: true,
        // Optional: Reset it to false if you are updating an existing admin
        mustChangePassword: false, 
      },
      create: {
        name,
        phoneNumber,
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        organizationId: org.id,
        isActive: true,
        // CRITICAL: Ensure Super Admin bypasses the force-change redirect
        mustChangePassword: false, 
      },
    });

    console.log("✅ Super Admin created successfully!");
    console.log(`📱 Phone: ${user.phoneNumber}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`🔓 Force Password Change: Disabled`);
  } catch (error) {
    console.error("❌ Error creating Super Admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();