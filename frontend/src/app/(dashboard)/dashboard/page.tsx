"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/api/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldAlert } from "lucide-react";
import SuperAdminDashboard from "@/components/dashboard/SuperAdminDashboard";
import OrgAdminGlobalOverview from "@/components/dashboard/OrgAdminGlobalOverview";

export default function UnifiedDashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  // We use a ref to prevent multiple auto-switch calls during re-renders
  const hasRedirected = useRef(false);

  // 1. Fetch branches for ORG_ADMINs
  const { data: branches, isLoading: isBranchesLoading } = useQuery({
    queryKey: ["my-branches"],
    queryFn: async () => {
      const res = await api.get("/auth/my-branches");
      return res.data.data.branches;
    },
    enabled: !!user && user.role === "ORG_ADMIN",
  });

  // 2. Mutation to set the active branch in the session/cookie
  const { mutate: autoSwitch, isPending: isSwitching } = useMutation({
    mutationFn: async (branchId: number) => {
      await api.post("/auth/switch-branch", { branchId });
    },
    onSuccess: () => {
      window.location.href = "/dashboard/main";
    },
  });

  // 3. Automatic Redirection Logic
  useEffect(() => {
    if (
      user?.role === "ORG_ADMIN" && 
      branches?.length === 1 && 
      !hasRedirected.current
    ) {
      hasRedirected.current = true;
      autoSwitch(branches[0].id);
    }
  }, [branches, user, autoSwitch]);


  // Show Skeleton during initial load OR while the auto-switch is redirecting
  if (isAuthLoading || (user?.role === "ORG_ADMIN" && (isBranchesLoading || isSwitching))) {
    return (
      <div className="p-10 space-y-6">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-[2rem]" />
      </div>
    );
  }

  // A. Super Admin view
  if (user?.role === "SUPER_ADMIN") {
    return <SuperAdminDashboard />;
  }



  if (user?.role === "ORG_ADMIN") {
    if (branches && branches.length > 1) {
      return <OrgAdminGlobalOverview branches={branches} />;
    }
    if (branches?.length === 1) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-black">
      {/* 1. Fake Sidebar Skeleton */}
      <div className="hidden md:flex w-64 flex-col border-r border-slate-200 dark:border-slate-800 p-4 space-y-6">
        <Skeleton className="h-10 w-32 rounded-lg" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-8 w-full rounded-md opacity-50" />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* 2. Fake Header Skeleton */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8">
          <Skeleton className="h-6 w-48 rounded-md" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </header>

        {/* 3. Main Content Skeleton */}
        <main className="p-8 space-y-8 overflow-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 rounded-[2rem]" />
            ))}
          </div>

          {/* Large Content Area */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-64 rounded-md" />
            <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
          </div>
        </main>
      </div>
    </div>
  );
}
    // Handle case where ORG_ADMIN has 0 branches (optional but good for safety)
    // return <div>No branches assigned to this organization.</div>;
  }

  // C. Fallback for unauthorized/empty states
 if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShieldAlert size={48} className="text-rose-500 mb-4" />
        <h1 className="text-2xl font-black uppercase italic">Access Denied</h1>
        <p className="text-slate-500 font-bold">Role: {user.role} is not authorized for this view.</p>
      </div>
    );
  }
  return null;
}








