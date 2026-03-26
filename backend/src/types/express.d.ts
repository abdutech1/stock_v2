import { UserRole } from "@prisma/client";

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: number;
        role: UserRole;
        organizationId: number;
        branchId?: number;
      };
    }
  }
}


declare namespace Express {
  export interface Request {
    user?: {
      id: number;
      role: string;
      organizationId: number;
      branchId?: number;
    };
  }
}