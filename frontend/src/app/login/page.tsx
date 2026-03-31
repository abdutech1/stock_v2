"use client";

import LoginForm from "@/components/LoginForm";
import { Suspense } from "react";
import { useApp } from "@/context/AppContext";
import Image from "next/image";

export default function LoginPage() {
  const { language } = useApp();

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 transition-colors duration-300">
      {/* Background Pattern to match Home Page */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1] bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-white/40 dark:border-slate-800 rounded-[3rem] shadow-2xl p-10">
          <div className="text-center mb-10">
            {/* Logo matching the Header style */}
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative w-20 h-20 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/30">
                <Image
                  src="/vortex-logo.png"
                  alt="Vortex"
                  fill
                  sizes="80px"
                  className="object-contain p-2"
                  priority
                />
              </div>
            </div>

            <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
              VORTEX
            </h1>
            
            <p className="text-slate-600 dark:text-slate-400 mt-3 font-medium text-sm">
              {language === "en" 
                ? "Welcome back! Please sign in." 
                : "እንኳን በደህና መጡ! እባክዎ ይግቡ።"}
            </p>
          </div>

          <Suspense 
            fallback={
              <div className="text-center py-10 text-slate-500 animate-pulse">
                {language === "en" ? "Loading..." : "በመጫን ላይ..."}
              </div>
            }
          >
            <LoginForm />
          </Suspense>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Vortex © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
