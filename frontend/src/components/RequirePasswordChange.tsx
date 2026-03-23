"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function RequirePasswordChange({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, mustChangePassword, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // If must change password → redirect to change-password page
    if (mustChangePassword) {
      router.replace("/change-password");
    }
  }, [isLoading, isAuthenticated, mustChangePassword, router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If must change password, don't show children — redirect is happening
  if (mustChangePassword) {
    return null;
  }

  return <>{children}</>;
}