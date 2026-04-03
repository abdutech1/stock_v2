// "use client";

// import Navbar from "@/components/Navbar";
// import { useAuth } from "@/hooks/useAuth";
// import { useRouter, usePathname } from "next/navigation";
// import { useEffect } from "react";
// import { RefreshCcw } from "lucide-react";

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   const { user, isLoading, mustChangePassword } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     if (isLoading) return;

//     if (!user) {
//       router.push("/login");
//       return;
//     }
//     if (mustChangePassword && pathname !== "/change-password") {
//       router.replace("/change-password");
//     }
//     if (!mustChangePassword && pathname === "/change-password") {
//       router.replace("/dashboard");
//     }
//   }, [user, isLoading, mustChangePassword, pathname, router]);

//   if (isLoading) {
//     return (
//       <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
//         <RefreshCcw className="animate-spin text-indigo-600" size={40} />
//         <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">
//           Authenticating...
//         </p>
//       </div>
//     );
//   }

//   if (!user) return null;

//   return (
//     <div className="relative flex min-h-screen flex-col">
      
//       {!mustChangePassword && <Navbar />}
      
//       <main className={`flex-1 ${mustChangePassword ? "flex items-center justify-center" : ""}`}>
//         {children}
//       </main>
//     </div>
//   );
// }




"use client";

import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { RefreshCcw } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading: isAuthLoading} = useAuth();
  const mustChangePassword = user?.mustChangePassword ?? false;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (mustChangePassword && pathname !== "/change-password") {
      router.replace("/change-password");
    }

    if (!mustChangePassword && pathname === "/change-password") {
      router.replace("/dashboard");
    }
  }, [user, isAuthLoading, mustChangePassword, pathname, router]);

  if (isAuthLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
        <RefreshCcw className="animate-spin text-indigo-600" size={40} />
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">
          Authenticating...
        </p>
      </div>
    );
  }

  if (!user) return null;

  // Hide Navbar on these special pages:
  // - Change password page
  // - Root /dashboard (Global Overview for multi-branch ORG_ADMIN or loading screen)
  const shouldHideNavbar = 
    mustChangePassword || 
    pathname === "/dashboard";

  return (
    <div className="relative flex min-h-screen flex-col">
      {!shouldHideNavbar && <Navbar />}

      <main
        className={`flex-1 ${
          mustChangePassword ? "flex items-center justify-center" : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
}
