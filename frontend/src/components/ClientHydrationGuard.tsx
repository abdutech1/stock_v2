"use client";

import { useApp } from "@/context/AppContext";

export default function ClientHydrationGuard({ children }: { children: React.ReactNode }) {
  const { hasHydrated } = useApp();

  // This part only runs on the user's browser
  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}