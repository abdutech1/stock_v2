"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useApp } from "@/context/AppContext";
import api from "@/api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, LogOut, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
// import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";

const translations = {
  en: {
    title: "Security Update",
    subtitle: "Set a new password to secure your account",
    currentPass: "Current Password",
    newPass: "New Password",
    confirmPass: "Confirm New Password",
    updateBtn: "Update Password",
    processing: "Updating...",
    matchError: "Passwords do not match",
    success: "Password updated! Redirecting...",
    logout: "Logout",
  },
  am: {
    title: "የደህንነት ማሻሻያ",
    subtitle: "መለያዎን ለመጠበቅ አዲስ የይለፍ ቃል ያዘጋጁ",
    currentPass: "የአሁኑ የይለፍ ቃል",
    newPass: "አዲስ የይለፍ ቃል",
    confirmPass: "አዲሱን የይለፍ ቃል ያረጋግጡ",
    updateBtn: "የይለፍ ቃል ቀይር",
    processing: "በማስተካከል ላይ...",
    matchError: "የይለፍ ቃላቱ አይዛመዱም",
    success: "በትክክል ተቀይሯል! ወደ ዋናው ገጽ በመመለስ ላይ...",
    logout: "ውጣ",
  },
};

export default function ChangePasswordPage() {
  const { language } = useApp();
  const t = translations[language as keyof typeof translations];
  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError(t.matchError);
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      setSuccess(true);
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {

  const responseData = err.response?.data;

  if (responseData?.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
    setError(responseData.errors[0].message);
  } 
  else if (responseData?.message) {
    setError(responseData.message);
  } 
  else {
    setError(err.message || "An unexpected error occurred.");
  }
} finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return null; 

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 transition-colors duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1] bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-white/40 dark:border-slate-800 rounded-[3rem] shadow-2xl p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg bg-indigo-600 flex items-center justify-center text-white">
                <ShieldCheck size={32} />
              </div>
            </div>

            <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
              {t.title}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium text-sm">
              {t.subtitle}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center space-y-4"
              >
                <div className="flex justify-center">
                   <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={40} />
                   </div>
                </div>
                <p className="text-green-700 dark:text-green-400 font-bold">{t.success}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-2xl text-xs font-bold animate-shake">
                    {error}
                  </div>
                )}

                {/* Current Password */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 ml-2">
                    {t.currentPass}
                  </label>
                  <div className="relative">
                    <input
                      type={showOld ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full h-12 px-5 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white outline-none font-bold transition-all"
                      required
                    />
                    <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-4 top-3 text-slate-400">
                      {showOld ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 ml-2">
                    {t.newPass}
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-12 px-5 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white outline-none font-bold transition-all"
                      required
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-3 text-slate-400">
                      {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 ml-2">
                    {t.confirmPass}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-12 px-5 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white outline-none font-bold transition-all"
                      required
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-3 text-slate-400">
                      {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-indigo-600 dark:bg-indigo-500 text-white font-black uppercase rounded-2xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <><Loader2 className="animate-spin" size={20} /> {t.processing}</>
                  ) : (
                    t.updateBtn
                  )}
                </button>
              </form>
            )}
          </AnimatePresence>

          <div className="mt-8 text-center">
            <button 
              onClick={logout} 
              className="text-[10px] font-black uppercase text-red-500 hover:text-red-600 flex items-center justify-center gap-1 mx-auto"
            >
              <LogOut size={14} /> {t.logout}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}