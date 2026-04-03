"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCcw, Home, AlertTriangle, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service like Sentry
    console.error("System Crash:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-xl w-full text-center space-y-8">
        
        {/* Warning Icon with Pulse Effect */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative inline-block"
        >
          <div className="absolute inset-0 bg-rose-500/20 blur-3xl rounded-full animate-pulse" />
          <div className="relative bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/30 p-8 rounded-[2.5rem] shadow-2xl">
            <AlertTriangle size={64} className="text-rose-500 mx-auto" />
          </div>
        </motion.div>

        {/* Error Messaging */}
        <div className="space-y-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-black italic tracking-tighter uppercase dark:text-white"
          >
            System <span className="text-rose-500">Fault.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest max-w-sm mx-auto"
          >
            The Vortex encountered an unexpected runtime exception. Our engineers have been notified.
          </motion.p>
        </div>

        {/* Technical Snippet (Optional/Debug) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-start gap-3 text-left overflow-hidden"
        >
          <Terminal size={14} className="text-indigo-500 mt-1 flex-shrink-0" />
          <code className="text-[10px] font-mono text-slate-600 dark:text-slate-400 break-all leading-tight">
            {error.message || "Unknown Runtime Error"}
            {error.digest && <div className="mt-1 text-indigo-400/60 font-black">ID: {error.digest}</div>}
          </code>
        </motion.div>

        {/* Recovery Actions */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* reset() tries to re-render the segment */}
          <Button 
            onClick={() => reset()}
            className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
          >
            <RefreshCcw size={16} /> Try Again
          </Button>

          <Button 
            variant="outline"
            onClick={() => window.location.href = '/dashboard'}
            className="w-full sm:w-auto h-12 px-8 rounded-2xl border-2 border-slate-200 dark:border-slate-800 font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 dark:hover:bg-slate-900 transition-all flex items-center gap-2 text-slate-500"
          >
            <Home size={16} /> Return Home
          </Button>
        </motion.div>

        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic opacity-50">
          Vortex Core v1.0 // Runtime Exception
        </p>
      </div>
    </div>
  );
}