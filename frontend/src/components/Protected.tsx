"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";



export default function Protected({
  children,
  requireRole = "ALL",
}: {
  children: React.ReactNode;
  requireRole?: "ALL" | "OWNER";
}) {
  const { user, isAuthenticated, isLoading, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const redirectTo =
        pathname !== "/login" ? `?redirect=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${redirectTo}`);
      return;
    }

    // Role-based protection
    if (requireRole === "OWNER" && role !== "OWNER") {
      router.replace("/dashboard");
      // Optional: you can show a toast/message here later
    }
  }, [isLoading, isAuthenticated, role, router, pathname, requireRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}