"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

import {
  LogOut,
  Menu,
  X,
  Bell,
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Wallet,
  CalendarCheck,
  Banknote,
  ShieldCheck,
  Sun,
  Moon,
  Settings
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import api from "@/api/axios";

// --- Navigation Config ---
const commonLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Sales", href: "/sales", icon: ShoppingCart },
];

const ownerLinks = [
  { name: "Stock", href: "/stocks", icon: Package },
  { name: "Expenses", href: "/expenses", icon: Wallet },
  { name: "HR", href: "/hr", icon: CalendarCheck },
  { name: "Payroll", href: "/salaries", icon: Banknote },
  { name: "Users", href: "/users", icon: Users },
];

// Empty for Super Admin as per your request
const adminLinks: any[] = []; 

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, language, toggleLanguage } = useApp();
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const userRole = user?.role;
  const isSuperAdmin = userRole === "SUPER_ADMIN";
  const isOrgAdmin = userRole === "ORG_ADMIN";
  const isEmployee = userRole === "EMPLOYEE";
  
  const canSeeAlerts = isOrgAdmin || isEmployee;

  const links = useMemo(() => {
    // Super Admin now returns empty array (No links in middle of Navbar)
    if (isSuperAdmin) return adminLinks; 
    if (isOrgAdmin) return [...commonLinks, ...ownerLinks];
    return [...commonLinks, { name: "Stock", href: "/stocks", icon: Package }];
  }, [userRole]);

  const displayName = user?.name || "User";

  useEffect(() => {
    setIsAlertOpen(false);
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: alertData } = useQuery({
    queryKey: ["navbar-alerts"],
    queryFn: async () => {
      const res = await api.get(`/reports/navbar-alerts`);
      return res.data;
    },
    enabled: !!user && canSeeAlerts,
    refetchInterval: 60000,
  });

  const totalAlerts = alertData?.count || 0;

  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 transition-all border-b w-full", 
        isScrolled 
          ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-slate-200 dark:border-slate-800 py-2" 
          : "bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-900 py-4"
      )}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-12">
          
          {/* LEFT: LOGO */}
          <Link href={isSuperAdmin ? "/system-dashboard" : "/dashboard"} className="flex items-center gap-2 group shrink-0">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden shadow-xl shadow-indigo-500/30">
              <Image
                src="/vortex-logo.png"
                alt="Vortex"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* MIDDLE: DESKTOP NAV (Will be empty for Super Admin) */}
          <nav className="hidden min-[1100px]:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-[11px] font-black uppercase tracking-wider rounded-xl flex items-center gap-2 transition-colors",
                  pathname === link.href 
                    ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                )}
              >
                <link.icon size={14} />
                {link.name}
              </Link>
            ))}
          </nav>

          {/* RIGHT: UTILS */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={toggleLanguage}
              className="text-[10px] font-black uppercase p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg dark:text-slate-400"
            >
              {language === 'en' ? 'AM' : 'EN'}
            </button>

            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-indigo-500 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {canSeeAlerts && (
              <div className="relative">
                <button onClick={() => setIsAlertOpen(!isAlertOpen)} className="p-2 text-slate-400 hover:text-rose-500 relative">
                  <Bell size={18} />
                  {totalAlerts > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {totalAlerts}
                    </span>
                  )}
                </button>
              </div>
            )}

            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-black text-xs shadow-md active:scale-95 transition-transform flex items-center justify-center"
              >
                {displayName.charAt(0).toUpperCase()}
              </button>
              
              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-[90]" onClick={() => setIsProfileOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-52 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-[24px] p-2 z-[100]"
                    >
                      <div className="p-3 mb-1 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                        <p className="text-[10px] font-black dark:text-white uppercase truncate">{displayName}</p>
                        <p className="text-[9px] font-bold text-indigo-500 uppercase italic">{userRole}</p>
                      </div>

                      {/* Special link for Super Admin inside profile menu instead of Navbar */}
                      {isSuperAdmin && (
                        <Link href="/system-dashboard" className="flex items-center gap-3 p-3 text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                          <Settings size={15} /> System Control
                        </Link>
                      )}

                      <Link href="/change-password" className="flex items-center gap-3 p-3 text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                        <ShieldCheck size={15} /> Security
                      </Link>
                      
                      <button onClick={logout} className="w-full flex items-center gap-3 p-3 text-[10px] font-black uppercase text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl transition-colors">
                        <LogOut size={15} /> Logout
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => setIsMobileMenuOpen(true)} className="min-[1100px]:hidden p-2 text-slate-600 dark:text-slate-400">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar logic (using the same 'links' array which is now empty for Super Admin) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-slate-950 z-[70] shadow-2xl flex flex-col">
              <div className="p-6 flex items-center justify-between border-b border-slate-50 dark:border-slate-900">
                <span className="text-sm font-black italic uppercase tracking-tighter dark:text-white">
                  Menu
                </span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-50 dark:bg-slate-900 rounded-full text-slate-400">
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all",
                      pathname === link.href
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900",
                    )}>
                    <link.icon size={18} /> {link.name}
                  </Link>
                ))}
              </nav>
              <div className="p-6 border-t border-slate-50 dark:border-slate-900 space-y-3">
                {isSuperAdmin && (
                  <Link
                    href="/system-dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-[20px] text-[11px] font-black uppercase">
                    <Settings size={16} /> System Control
                  </Link>
                )}
                <button onClick={logout} className="w-full flex items-center justify-center gap-2 p-4 bg-rose-50 dark:bg-rose-900/10 text-rose-600 rounded-[20px] text-[11px] font-black uppercase">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}