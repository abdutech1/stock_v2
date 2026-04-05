"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Protected({
  children,
  requireRole = "ALL",
}: {
  children: React.ReactNode;
  requireRole?: "ALL" | "ORG_ADMIN" | "EMPLOYEE";
}) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const redirectTo = pathname !== "/login" ? `?redirect=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${redirectTo}`);
      return;
    }

    // Role-based protection: Only ORG_ADMIN can access User Management
    if (requireRole !== "ALL" && role !== requireRole) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, role, router, pathname, requireRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-r-transparent"></div>
          <p className="text-slate-400 font-bold animate-pulse uppercase text-[10px] tracking-widest">Loading Secure Access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}