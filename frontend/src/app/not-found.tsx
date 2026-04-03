"use client";

import Link from "next/link";
import { useRouter } from "next/navigation"; // Import the router
import { motion } from "framer-motion";
import { MoveLeft, Home, ShieldQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter(); // Initialize the router

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 transition-colors duration-500">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Animated Icon Container */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative inline-block"
        >
          <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
            <ShieldQuestion size={64} className="text-indigo-600 dark:text-indigo-400 mx-auto" />
          </div>
        </motion.div>

        {/* Text Content */}
        <div className="space-y-3">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-7xl font-black italic tracking-tighter uppercase dark:text-white"
          >
            404<span className="text-indigo-600">.</span>
          </motion.h1>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-black uppercase tracking-widest text-slate-900 dark:text-slate-100"
          >
            Lost in the <span className="text-indigo-600">Vortex</span>
          </motion.h2>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-tight max-w-[280px] mx-auto leading-relaxed"
          >
            The page you are looking for has been moved, deleted, or never existed in this dimension.
          </motion.p>
        </div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Fixed "Go Back" Button */}
          <Button 
            variant="outline"
            onClick={() => router.back()} // Use router.back() instead of javascript:href
            className="w-full sm:w-auto h-12 px-8 rounded-2xl border-2 border-slate-200 dark:border-slate-800 font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 dark:hover:bg-slate-900 transition-all flex items-center gap-2 text-slate-500 dark:text-slate-400"
          >
            <MoveLeft size={16} /> Go Back
          </Button>

          <Button 
            asChild
            className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-500/25 transition-all"
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <Home size={16} /> Dashboard
            </Link>
          </Button>
        </motion.div>

        {/* Footer Detail */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] italic"
        >
          System Error // Route Not Found
        </motion.p>
      </div>
    </div>
  );
}