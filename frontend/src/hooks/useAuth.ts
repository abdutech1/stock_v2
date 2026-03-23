"use client";

import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, login as loginApi, logout as logoutApi } from "@/api/auth.api";

export type UserRole = "OWNER" | "EMPLOYEE";

export interface AuthUser {
  id: string;
  phoneNumber: string;
  name?: string;
  role: UserRole;
  mustChangePassword: boolean;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter()
  

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const login = async (phoneNumber: string, password: string) => {
    await loginApi(phoneNumber, password);
    await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.warn("Logout API call failed", err);
    } finally {
      queryClient.removeQueries({ queryKey: ["auth", "me"] });
      queryClient.clear();
      router.replace("/login");
    }
  };

  const user = (data?.user as AuthUser | null) ?? null;
  const role = user?.role;
  const mustChangePassword = user?.mustChangePassword ?? false;

  return {
    user,
    role,
    mustChangePassword,
    isAuthenticated: !!user,
    isLoading,
    isError,
    error,
    login,
    logout,
    queryClient
  };
}