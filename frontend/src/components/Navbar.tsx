"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  LogOut, Menu, X, Bell, LayoutDashboard, ShoppingCart,
  Package, Users, Wallet, CalendarCheck, Banknote,
  ShieldCheck, Sun, Moon, Settings, MapPin, ChevronDown, Check
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import api from "@/api/axios";

// --- Translations ---
const navTranslations: any = {
  en: {
    dashboard: "Dashboard",
    sales: "Sales",
    stock: "Stock",
    expenses: "Expenses",
    hr: "HR",
    payroll: "Payroll",
    users: "Users",
    systemControl: "System Control",
    security: "Security",
    logout: "Logout",
    branch: "Branch",
    switchBranch: "Switch Branch"
  },
  am: {
    dashboard: "ዳሽቦርድ",
    sales: "ሽያጭ",
    stock: "ክምችት",
    expenses: "ወጪዎች",
    hr: "የሰው ኃይል",
    payroll: "ደመወዝ",
    users: "ተጠቃሚዎች",
    systemControl: "ሲስተም መቆጣጠሪያ",
    security: "ደህንነት",
    logout: "ውጣ",
    branch: "ቅርንጫፍ",
    switchBranch: "ቅርንጫፍ ቀይር"
  }
};

export default function Navbar() {
  const { user, logout} = useAuth(); 
  const { 
    theme, 
    toggleTheme, 
    language, 
    toggleLanguage, 
    activeBranchId, 
    setActiveBranchId 
  } = useApp();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const t = navTranslations[language || 'en'];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBranchOpen, setIsBranchOpen] = useState(false);

  const userRole = user?.role;
  const isSuperAdmin = userRole === "SUPER_ADMIN";
  const isOrgAdmin = userRole === "ORG_ADMIN";
  const isEmployee = userRole === "EMPLOYEE";



  const { data: branchList } = useQuery({
  queryKey: ["my-branches"],
  queryFn: async () => {
    const res = await api.get("/auth/my-branches");
    return res.data.data.branches; // This is the simple [ {id, name} ] array
  },
  enabled: !!user && user.role === "ORG_ADMIN",
});
  

 const currentBranch = useMemo(() => {
  if (!branchList) return null;
  return branchList.find((b: any) => b.id === activeBranchId) || branchList[0];
}, [branchList, activeBranchId]);

  // --- Dynamic Links with Translation ---
  const links = useMemo(() => {
    if (isSuperAdmin) return [];
    
    const base = [
      { name: t.dashboard, href: "/dashboard", icon: LayoutDashboard },
      { name: t.sales, href: "/sales", icon: ShoppingCart },
    ];

    if (isOrgAdmin) {
      return [
        ...base,
        { name: t.stock, href: "/stocks", icon: Package },
        { name: t.expenses, href: "/expenses", icon: Wallet },
        { name: t.hr, href: "/hr", icon: CalendarCheck },
        { name: t.payroll, href: "/salaries", icon: Banknote },
        { name: t.users, href: "/users", icon: Users },
      ];
    }
    return [...base, { name: t.stock, href: "/stocks", icon: Package }];
  }, [userRole, language]);

  const displayName = user?.name || "User";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

const handleBranchSwitch = (branchId: number) => {
  setActiveBranchId(branchId);
  setIsBranchOpen(false);
  // This clears the dashboard stats and branch list to force a fresh look
  queryClient.invalidateQueries(); 
  toast.success(language === 'en' ? "Branch Switched" : "ቅርንጫፍ ተቀይሯል");
};

  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 transition-all border-b w-full", 
        isScrolled 
          ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-slate-200 dark:border-slate-800 py-2" 
          : "bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-900 py-4"
      )}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-12">
          
          {/* LEFT: LOGO & BRANCH SWITCHER */}
          <div className="flex items-center gap-6">
            <Link href={isSuperAdmin ? "/system-dashboard" : "/dashboard"} className="shrink-0">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-indigo-500/20">
                <Image src="/vortex-logo.png" alt="Vortex" fill className="object-contain" priority />
              </div>
            </Link>

            {/* Desktop Branch Switcher */}
            {!isSuperAdmin && (branchList?.length ?? 0) > 0 && (
              <div className="relative hidden md:block">
                <button 
                  onClick={() => setIsBranchOpen(!isBranchOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-300 transition-all"
                >
                  <MapPin size={14} className="text-indigo-500" />
                  <div className="text-left">
                    <p className="text-[9px] font-black uppercase text-slate-400 leading-none">{t.branch}</p>
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate max-w-[120px]">
                      {currentBranch?.name || "Select Branch"}
                    </p>
                  </div>
                  <ChevronDown size={14} className={cn("text-slate-400 transition-transform", isBranchOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {isBranchOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-2xl p-2 z-[100]"
                    >
                      <p className="px-3 py-2 text-[9px] font-black uppercase text-slate-400 tracking-widest">{t.switchBranch}</p>
                      {branchList?.map((b: any) => (
                        <button
                          key={b.id}
                          onClick={() => handleBranchSwitch(b.id)}
                          className={cn(
                            "w-full flex items-center justify-between p-3 rounded-xl text-[11px] font-bold transition-all",
                            activeBranchId === b.id 
                              ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600" 
                              : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                          )}
                        >
                          <span className="truncate">{b.name}</span>
                          {activeBranchId === b.id && <Check size={14} />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* MIDDLE: DESKTOP NAV */}
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
            <div className="hidden sm:flex items-center gap-2">
                <button 
                onClick={toggleLanguage}
                className="text-[10px] font-black uppercase w-9 h-9 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl dark:text-slate-400"
                >
                {language === 'en' ? 'አማ' : 'EN'}
                </button>

                <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-indigo-500 transition-colors">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-black text-xs shadow-md flex items-center justify-center"
              >
                {displayName.charAt(0).toUpperCase()}
              </button>
              
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-52 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-[24px] p-2 z-[100]"
                  >
                    <div className="p-3 mb-1 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                      <p className="text-[10px] font-black dark:text-white uppercase truncate">{displayName}</p>
                      <p className="text-[9px] font-bold text-indigo-500 uppercase italic">{userRole}</p>
                    </div>
                    <Link href="/change-password" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 p-3 text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                      <ShieldCheck size={15} /> {t.security}
                    </Link>
                    <button onClick={logout} className="w-full flex items-center gap-3 p-3 text-[10px] font-black uppercase text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl transition-colors">
                      <LogOut size={15} /> {t.logout}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Trigger */}
            <button onClick={() => setIsMobileMenuOpen(true)} className="min-[1100px]:hidden p-2 text-slate-600 dark:text-slate-400">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[60] min-[1100px]:hidden"
            />
            
            {/* Menu Panel */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[280px] bg-white dark:bg-slate-950 z-[70] shadow-2xl p-6 flex flex-col min-[1100px]:hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <p className="text-xs font-black uppercase tracking-tighter dark:text-white">Menu</p>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              {/* Branch Switcher for Mobile */}
              {!isSuperAdmin && (branchList?.length ?? 0) > 0 && (
                <div className="mb-8">
                    <p className="text-[9px] font-black uppercase text-slate-400 mb-3 ml-2">{t.switchBranch}</p>
                    <div className="grid grid-cols-1 gap-2">
                        {branchList?.map((b: any) => (
                            <button
                                key={b.id}
                                onClick={() => {
                                    handleBranchSwitch(b.id);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={cn(
                                    "flex items-center justify-between p-3 rounded-2xl text-[11px] font-bold transition-all border",
                                    activeBranchId === b.id 
                                    ? "bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-800" 
                                    : "bg-slate-50 border-slate-100 dark:bg-slate-900 dark:border-slate-800 text-slate-600"
                                )}
                            >
                                {b.name}
                                {activeBranchId === b.id && <Check size={14} />}
                            </button>
                        ))}
                    </div>
                </div>
              )}

              {/* Links */}
              <nav className="flex flex-col gap-2 overflow-y-auto flex-1">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "p-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-4 transition-all",
                      pathname === link.href 
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                    )}
                  >
                    <link.icon size={18} />
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* Bottom Actions */}
              <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3">
                <button 
                  onClick={toggleLanguage}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 gap-1"
                >
                  <p className="text-[8px] font-black text-slate-400 uppercase">Lang</p>
                  <p className="text-[10px] font-black dark:text-white">{language === 'en' ? 'አማርኛ' : 'English'}</p>
                </button>
                <button 
                  onClick={toggleTheme}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 gap-1"
                >
                   <p className="text-[8px] font-black text-slate-400 uppercase">Theme</p>
                   {theme === 'dark' ? <Sun size={16} className="text-white"/> : <Moon size={16} className="text-slate-900"/>}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}