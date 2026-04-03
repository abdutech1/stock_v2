"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

import {
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  ShieldCheck,
  Settings,
  LayoutDashboard,
  Globe,
  ChevronDown
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, language, toggleLanguage } = useApp();
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const displayName = user?.name || "User";

  // Auto-close menus on navigation
  useEffect(() => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle scroll styles
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 transition-all border-b w-full", 
        isScrolled 
          ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-slate-200 dark:border-slate-800 py-2" 
          : "bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-900 py-2"
      )}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-12">
          
          {/* LEFT: LOGO */}
          <Link href={isSuperAdmin ? "/system-dashboard" : "/dashboard"} className="flex items-center gap-2 group shrink-0">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-indigo-500/20 bg-indigo-600 flex items-center justify-center">
               <Image
                src="/vortex-logo.png" 
                alt="Logo"
                width={32}
                height={32}
                className="object-contain p-1"
              />
            </div>
            {/* <span className="font-black text-xl tracking-tighter uppercase italic dark:text-white hidden sm:block">
              Vortex<span className="text-indigo-600">.</span>
            </span> */}
          </Link>

          {/* RIGHT: UTILS & PROFILE */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Language Switcher */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              {/* <Globe size={16} className="text-slate-500" /> */}
              <span className="text-[10px] font-black uppercase dark:text-slate-300">
                {language === 'en' ? 'AM' : 'EN'}
              </span>
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all active:scale-95"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-black text-xs shadow-md flex items-center justify-center">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                {/* <div className="hidden md:block text-left">
                  <p className="text-[10px] font-black dark:text-white uppercase leading-none">{displayName}</p>
                  <p className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest mt-1 italic">{user?.role}</p>
                </div> */}
                <ChevronDown size={14} className={cn("text-slate-400 transition-transform", isProfileOpen && "rotate-180")} />
              </button>
              
              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-[90]" onClick={() => setIsProfileOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                      animate={{ opacity: 1, y: 0, scale: 1 }} 
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-60 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-[24px] p-2 z-[100] overflow-hidden"
                    >
                      <div className="p-4 mb-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                        <p className="text-[11px] font-black dark:text-white uppercase truncate">{displayName}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight truncate">{user?.phoneNumber}</p>
                      </div>

                      <div className="space-y-1">
                        {isSuperAdmin ? (
                           <Link href="/system-dashboard" className="flex items-center gap-3 p-3 text-[10px] font-black uppercase text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all">
                            <Settings size={16} /> System Control
                          </Link>
                        ) : (
                          <Link href="/dashboard" className="flex items-center gap-3 p-3 text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                            <LayoutDashboard size={16} /> Overview
                          </Link>
                        )}

                        <Link href="/change-password" className="flex items-center gap-3 p-3 text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                          <ShieldCheck size={16} /> Security Settings
                        </Link>
                        
                        <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-1" />

                        <button 
                          onClick={logout} 
                          className="w-full flex items-center gap-3 p-3 text-[10px] font-black uppercase text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl transition-colors"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => setIsMobileMenuOpen(true)} className="min-[1100px]:hidden p-2 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-xl">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}