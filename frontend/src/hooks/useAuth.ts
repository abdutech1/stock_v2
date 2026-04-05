"use client";

import { useRouter } from "next/navigation";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getMe, login as loginApi, logout as logoutApi } from "@/api/auth.api";
import { toast } from "react-hot-toast";


export type UserRole = "SUPER_ADMIN" | "ORG_ADMIN" | "EMPLOYEE";

export interface UserBranch {
  branch: {
    id: number;
    name: string;
  };
}

export interface AuthUser {
  id: number;
  phoneNumber: string;
  name: string;
  role: UserRole;
  activeBranchId?: number;
  organizationId: number;
  branchId?: number; // Keep this for employees
  branches?: UserBranch[]; // Add this for ORG_ADMINs
  mustChangePassword: boolean;
  organization?: {
    name: string;
    slug: string;
    plan: string;
  };
}

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    retry: false,
    staleTime: 10 * 60 * 1000,
  });

  // const loginMutation = useMutation({
  //   mutationFn: ({ p, pw }: { p: string; pw: string }) => loginApi(p, pw),
  //   onSuccess: (responseData) => {
  //     queryClient.setQueryData(["auth", "me"], responseData.data);
  //     toast.success("Welcome back!");
  //     // router.push("/dashboard");
  //   },
  // });

  const loginMutation = useMutation({
  mutationFn: ({ p, pw }: { p: string; pw: string }) => loginApi(p, pw),
  onSuccess: (responseData) => {
    // 1. Update the cache with new user data
    queryClient.setQueryData(["auth", "me"], responseData); 
    // 2. IMPORTANT: Invalidate the query to force a fresh fetch
    queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    
    toast.success("Welcome back!");
  },
});
  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      queryClient.clear();
      router.replace("/login");
    }
  };

  const user = (data?.user as AuthUser) ?? null;

  return {
    user,
    role: user?.role,
    isAuthenticated: !!user,
    isAdmin: user?.role === "SUPER_ADMIN" || user?.role === "ORG_ADMIN",
    isLoading,
    isError,
    login: (p: string, pw: string) => loginMutation.mutateAsync({ p, pw }),
    isLoggingIn: loginMutation.isPending,
    logout,
  };
}







