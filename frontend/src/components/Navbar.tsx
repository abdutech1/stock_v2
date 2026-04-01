"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import {
  LogOut,
  UserCircle,
  Menu,
  X,
  Bell,
  AlertTriangle,
  LayoutDashboard,
  ShoppingCart,
  BarChart3,
  Package,
  Users,
  Wallet,
  CalendarCheck,
  Banknote,
  PackageSearch,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
// import axios from "axios";-
import api from "@/api/axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const commonLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Sales", href: "/sales", icon: ShoppingCart },
];

const ownerLinks = [
  { name: "Stock", href: "/stocks", icon: Package },
  { name: "Expenses", href: "/expenses", icon: Wallet },
  { name: "Reconciliation", href: "/reconciliation", icon: Wallet },
  { name: "HR", href: "/hr", icon: CalendarCheck },
  { name: "Payroll", href: "/salaries", icon: Banknote },
  { name: "Users", href: "/users", icon: Users },
];

const AlertSkeleton = () => (
  <div className="animate-pulse space-y-4 p-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-100 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-2 w-20 bg-slate-100 rounded" />
          <div className="h-2 w-12 bg-slate-50 rounded" />
        </div>
        <div className="w-8 h-4 bg-slate-100 rounded shrink-0" />
      </div>
    ))}
  </div>
);

export default function Navbar() {
  const { user, logout, role } = useAuth();
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isOwner = role === "OWNER";
  const links = useMemo(
    () => [...commonLinks, ...(isOwner ? ownerLinks : [])],
    [isOwner],
  );
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

  const {
    data: alertData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["navbar-alerts"],
    queryFn: async () => {
      const res = await api.get(`/reports/navbar-alerts`, {
        withCredentials: true,
      });
      return res.data;
    },
    enabled: isOwner && !!user,
    refetchInterval: 60000,
  });

  const lowStockItems = alertData?.items || [];
  const totalAlerts = alertData?.count || 0;

  const getImageUrl = (path: string) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300 border-b w-full",
          isScrolled
            ? "bg-white/90 backdrop-blur-xl border-slate-200/80 shadow-sm py-2"
            : "bg-white border-slate-100 py-4",
        )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center gap-4 min-[1200px]:gap-8 overflow-hidden">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 shrink-0 group">
                <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg group-hover:scale-105 transition-transform">
                  <UserCircle size={20} />
                </div>
                <div className="hidden min-[400px]:block">
                  <span className="text-lg font-black tracking-tighter text-slate-900 uppercase italic">
                    Jemo
                  </span>
                  <span className="text-lg font-light tracking-tighter text-slate-500 uppercase italic ml-0.5">
                    Boutique
                  </span>
                </div>
              </Link>

              <nav className="hidden min-[1100px]:flex items-center gap-0.5 overflow-hidden">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "relative px-3 py-2 text-[11px] font-black uppercase tracking-wider transition-all rounded-xl flex items-center gap-2 shrink-0",
                        isActive
                          ? "text-indigo-600"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50",
                      )}>
                      {isActive && (
                        <motion.div
                          layoutId="nav-pill"
                          className="absolute inset-0 bg-indigo-50/50 rounded-xl -z-10"
                        />
                      )}
                      <link.icon size={14} strokeWidth={isActive ? 2.5 : 2} />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              {isOwner && (
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsAlertOpen(!isAlertOpen);
                      setIsProfileOpen(false);
                    }}
                    className={cn(
                      "relative p-2 rounded-full transition-all shrink-0", // Added shrink-0
                      isAlertOpen
                        ? "text-rose-600 bg-rose-50"
                        : "text-slate-400 hover:text-rose-600 hover:bg-rose-50",
                    )}>
                    <Bell size={18} />

                    {/* Show a small gray dot if loading so you know it's working */}
                    {isLoading && (
                      <span className="absolute top-2 right-2 w-2 h-2 bg-slate-300 rounded-full animate-pulse" />
                    )}

                    {totalAlerts > 0 && !isError && !isLoading && (
                      <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-rose-500 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center animate-pulse z-10 shadow-sm">
                        {totalAlerts > 99 ? "99+" : totalAlerts}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {isAlertOpen && (
                      <>
                        {/* Backdrop overlay */}
                        <div
                          className="fixed inset-0 z-[90] bg-slate-900/10 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none"
                          onClick={() => setIsAlertOpen(false)}
                        />

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className={cn(
                            "z-[1001] bg-white border border-slate-100 shadow-2xl rounded-[24px] overflow-hidden",
                            "fixed inset-x-4 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-3 sm:w-80",
                            "max-h-[80vh] flex flex-col",
                          )}>
                          <div className="p-5 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <AlertTriangle
                                size={16}
                                className="text-rose-500"
                              />
                              <p className="text-[10px] font-black uppercase text-rose-600 tracking-widest">
                                Low Stock Alert
                              </p>
                            </div>
                            <button
                              onClick={() => setIsAlertOpen(false)}
                              className="text-rose-400 hover:text-rose-600">
                              <X size={14} />
                            </button>
                          </div>

                          <div className="max-h-[60vh] sm:max-h-72 overflow-y-auto divide-y divide-slate-50">
                            {isLoading ? (
                              <AlertSkeleton />
                            ) : lowStockItems.length === 0 ? (
                              <div className="p-10 text-center text-slate-300">
                                <PackageSearch
                                  size={32}
                                  className="mx-auto mb-2 opacity-20"
                                />
                                <p className="text-[10px] font-black uppercase">
                                  Inventory is Healthy
                                </p>
                              </div>
                            ) : (
                              lowStockItems.map((item: any) => (
                                <div
                                  key={item.priceCategoryId}
                                  className="p-4 hover:bg-slate-50 transition-colors">
                                  <div className="flex justify-between items-center gap-3">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                        <img
                                          src={
                                            getImageUrl(
                                              item.imageUrl ||
                                                item.category?.imageUrl,
                                            ) || ""
                                          }
                                          alt=""
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-[11px] font-black text-slate-900 uppercase leading-tight truncate">
                                          {item.category?.name}
                                        </p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tabular-nums">
                                          {item.fixedPrice?.toLocaleString()}{" "}
                                          ETB
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <p className="text-xs font-black text-rose-500 tabular-nums">
                                        {item.stock?.quantity ?? 0}
                                      </p>
                                      <p className="text-[8px] font-bold text-slate-300 uppercase leading-none">
                                        Left
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>

                          <Link
                            href="/stocks"
                            className="flex items-center justify-between p-4 bg-slate-50 text-[10px] font-black uppercase text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all group/btn">
                            Manage All Stock
                            <ChevronRight
                              size={14}
                              className="group-hover/btn:translate-x-1 transition-transform"
                            />
                          </Link>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <div className="h-6 w-[1px] bg-slate-100 hidden sm:block mx-1"></div>

              <div className="relative">
                <button
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsAlertOpen(false);
                  }}
                  className={cn(
                    "w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs transition-all active:scale-95 shadow-md",
                    isProfileOpen
                      ? "bg-indigo-700 ring-4 ring-indigo-50 text-white"
                      : "bg-gradient-to-br from-indigo-500 to-indigo-700 text-white hover:shadow-indigo-100",
                  )}>
                  {displayName.charAt(0).toUpperCase()}
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-[90]"
                        onClick={() => setIsProfileOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-52 bg-white border border-slate-100 shadow-2xl rounded-[24px] overflow-hidden p-2 z-[100]">
                        {/* User Info Header */}
                        <div className="p-3 mb-1 bg-slate-50 rounded-2xl">
                          <p className="text-[10px] font-black text-slate-900 truncate uppercase">
                            {displayName}
                          </p>
                          <p className="text-[9px] font-bold text-indigo-500 uppercase italic tracking-wider">
                            {role}
                          </p>
                        </div>

                        {/* Change Password Link */}
                        <Link
                          href="/change-password"
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full flex items-center gap-3 p-3 text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all group">
                          <ShieldCheck
                            size={15}
                            className="group-hover:rotate-12 transition-transform"
                          />
                          Security
                        </Link>

                        {/* Logout Button */}
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-3 p-3 text-[10px] font-black uppercase text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                          <LogOut size={15} /> Logout
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="min-[1100px]:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- Mobile Sidebar --- */}
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
              className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white z-[70] shadow-2xl flex flex-col">
              <div className="p-6 flex items-center justify-between border-b border-slate-50">
                <span className="text-sm font-black italic uppercase tracking-tighter">
                  Menu
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-slate-50 rounded-full text-slate-400">
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all",
                      pathname === link.href
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "text-slate-500 hover:bg-slate-50",
                    )}>
                    <link.icon size={18} /> {link.name}
                  </Link>
                ))}
              </nav>
              {/* Inside the Mobile Sidebar (near the logout button) */}
              <div className="p-6 border-t border-slate-50 space-y-3">
                <Link
                  href="/change-password"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 p-4 bg-slate-50 text-slate-600 rounded-[20px] text-[11px] font-black uppercase">
                  <ShieldCheck size={16} /> Security
                </Link>

                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 p-4 bg-rose-50 text-rose-600 rounded-[20px] text-[11px] font-black uppercase">
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
