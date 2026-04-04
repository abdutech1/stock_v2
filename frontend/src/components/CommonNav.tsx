"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LogOut, Menu, Sun, Moon, ShieldCheck, Settings, LayoutDashboard, ChevronDown } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, language, toggleLanguage } = useApp();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const displayName = user?.name || "User";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 5);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-[100] transition-all border-b w-full", // Increased z-index
      isScrolled 
        ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-slate-200 dark:border-slate-800 shadow-sm" 
        : "bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-900"
    )}>
      {/* Tightened h-14 and removed extra outer padding to pin it to top */}
      <div className="max-w-[1400px] mx-auto px-4 flex justify-between items-center h-14">
        
        <Link href={isSuperAdmin ? "/system-dashboard" : "/dashboard"} className="flex items-center gap-2 group">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-indigo-500/20 bg-indigo-600 flex items-center justify-center">
             <Image src="/vortex-logo.png" alt="Logo" width={28} height={28} className="object-contain p-1" />
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center justify-center w-10 h-10 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all border border-transparent"
          >
            <span className="text-[11px] font-black uppercase dark:text-slate-300">
              {language === 'en' ? 'አማ' : 'EN'}
            </span>
          </button>

          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="p-2.5 text-slate-500 hover:text-indigo-600 rounded-xl transition-all">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />

          {/* Profile */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 pr-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black text-[10px] flex items-center justify-center">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <ChevronDown size={12} className={cn("text-slate-400 transition-transform", isProfileOpen && "rotate-180")} />
            </button>
            
            <AnimatePresence>
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-2xl p-2 z-20"
                  >
                    <div className="p-4 mb-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                        <p className="text-[11px] font-black dark:text-white uppercase truncate">{displayName}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight truncate">{user?.phoneNumber}</p>
                      </div>

                      <div className="space-y-1">
                        {isSuperAdmin && (
                           <Link href="/system-dashboard" className="flex items-center gap-3 p-3 text-[10px] font-black uppercase text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all">
                            <Settings size={16} /> System Control
                          </Link>
                        ) }

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
        </div>
      </div>
    </header>
  );
}