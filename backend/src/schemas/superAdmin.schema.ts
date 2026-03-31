import { z } from "zod";
import { Plan } from "@prisma/client";

// export const onboardOrgSchema = z.object({
//   body: z.object({
//     name: z.string().min(2, "Organization name is required"),
//     slug: z
//       .string()
//       .min(2)
//       .toLowerCase()
//       .regex(/^[a-z0-9-]+$/, "Slug must be URL-friendly"),
//     adminName: z.string().min(2, "Admin name is required"),
//     adminPhone: z.string().min(9, "Valid phone number is required"),
//   }),
// });

export const onboardOrgSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Organization name is required"),
    slug: z
      .string()
      .min(2)
      .toLowerCase()
      .regex(/^[a-z0-9-]+$/, "Slug must be URL-friendly"),
    adminName: z.string().min(2, "Admin name is required"),
    adminPhone: z.string().min(9, "Valid phone number is required"),
    plan: z.nativeEnum(Plan).default(Plan.FREE), 
  }),
});


/**
 * CREATE BRANCH
 */
// export const createBranchSchema = z.object({
//   body: z.object({
//     branchName: z.string().min(2, "Branch name is too short"),
//   }),
// });
export const createBranchSchema = z.object({
  body: z.object({
    branchName: z.string().min(2, "Branch name is too short"),
    // Add this so the ID passes validation
    organizationId: z.coerce.number().positive("Valid Organization ID is required"),
  }),
});

/**
 * UPDATE BRANCH
 */
export const updateBranchSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Branch name is too short"),
  }),
});

/**
 * TOGGLE USER STATUS
 */
export const toggleStatusSchema = z.object({
  body: z.object({
    isActive: z.boolean(),
  }),
});

// Update Organization Schema
export const updateOrgSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    plan: z.nativeEnum(Plan).optional(),
    isActive: z.boolean().optional(),
  }),
});

// Add Additional ORG_ADMIN Schema
export const addOrgAdminSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name is required"),
    phoneNumber: z.string().min(9, "Valid phone is required"),
  }),
});

// Update Subscription Schema
export const upgradePlanSchema = z.object({
  body: z.object({
    plan: z.nativeEnum(Plan),
  }),
});