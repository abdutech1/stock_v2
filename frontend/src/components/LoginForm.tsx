"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Phone, Lock, Loader2 } from "lucide-react"; // Added Loader2
import { useApp } from "@/context/AppContext";

const loginTranslations = {
  en: {
    title: "Sign In",
    phone: "Phone Number",
    password: "Password",
    button: "Sign In",
    submitting: "Signing in...",
    placeholderPhone: "09...",
    errorFallback: "Login failed.",
  },
  am: {
    title: "ግባ",
    phone: "ስልክ ቁጥር",
    password: "የይለፍ ቃል",
    button: "ግባ",
    submitting: "በመግባት ላይ...",
    placeholderPhone: "09...",
    errorFallback: "መግባት አልተቻለም።",
  },
};

export default function LoginForm() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { language } = useApp();
  // We use isLoggingIn directly from the hook
  const { login, isLoggingIn } = useAuth();
  const t = loginTranslations[language as keyof typeof loginTranslations];

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  try {
    // result is now { user: { id, name, role, mustChangePassword... } }
    const result = await login(phoneNumber.trim(), password);

    // Access the user from the result
    const user = result?.user;

    if (!user) {
      throw new Error("User data is missing from the response.");
    }

    const isSuperAdmin = user.role === "SUPER_ADMIN";
    const needsPasswordChange = user.mustChangePassword;

    // Logic: Super Admin skips the force-change, everyone else with the flag is redirected
    if (!isSuperAdmin && needsPasswordChange) {
      router.push("/change-password");
    } else {
      const redirectTo = searchParams.get("redirect") || "/dashboard";
      router.push(redirectTo);
    }
    
    router.refresh();

  } catch (err: any) {
    // This will catch the error properly and display it in your UI
    const backendMessage =
      err.response?.data?.message || err.message || t.errorFallback;
    setError(backendMessage);
  }
};

  return (
    <div className="w-full max-w-md mx-auto">
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl text-sm animate-in fade-in slide-in-from-top-1">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Phone Input */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            <Phone size={18} className="text-indigo-600 dark:text-indigo-400" /> {t.phone}
          </label>
          <input
            type="tel"
            disabled={isLoggingIn}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-5 py-4 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white outline-none transition-all disabled:opacity-50"
            required
          />
        </div>

        {/* Password Input */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            <Lock size={18} className="text-indigo-600 dark:text-indigo-400" /> {t.password}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              disabled={isLoggingIn}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white outline-none transition-all disabled:opacity-50"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>
        </div>

        {/* The Integrated Button */}
        <button
          type="submit"
          disabled={isLoggingIn}
          className="w-full py-4 bg-indigo-600 dark:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              {t.submitting}
            </>
          ) : (
            t.button
          )}
        </button>
      </form>
    </div>
  );
}