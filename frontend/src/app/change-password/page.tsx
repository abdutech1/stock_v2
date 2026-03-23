"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import api from "@/api/axios";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, LogOut, Sparkles } from "lucide-react";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, logout, queryClient, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      // Calls your Express /api/auth/change-password endpoint
      await api.post("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      setSuccess(true);

      // Refresh the 'me' query so mustChangePassword becomes false
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="relative min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-3xl shadow-2xl p-10 md:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-indigo-600 text-white shadow-xl">
              <Lock size={36} />
            </div>
            <h1 className="text-4xl font-extrabold bg-linear-to-br from-indigo-700 to-pink-600 bg-clip-text text-transparent">
              Set New Password
            </h1>
            <p className="text-gray-600 mt-2">Security update required</p>
          </div>

          {success && (
            <div className="mb-8 p-5 bg-green-50 border border-green-300 rounded-2xl text-green-800 text-center font-semibold">
              Success! Redirecting to dashboard...
            </div>
          )}

          {error && (
            <div className="mb-8 p-5 bg-red-50 border border-red-300 rounded-2xl text-red-800 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password Field */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Current Password</label>
              <div className="relative mt-2">
                <input
                  type={showOld ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-300 rounded-2xl"
                  required
                />
                <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-4 top-4 text-gray-500">
                  {showOld ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            {/* New Password Field */}
            <div>
              <label className="text-sm font-semibold text-gray-700">New Password</label>
              <div className="relative mt-2">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-300 rounded-2xl"
                  required
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-4 text-gray-500">
                  {showNew ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password Field */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Confirm New Password</label>
              <div className="relative mt-2">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-300 rounded-2xl"
                  required
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-4 text-gray-500">
                  {showConfirm ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || success}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {isSubmitting ? "Processing..." : "Update Password"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button onClick={logout} className="text-red-600 hover:text-red-700 inline-flex items-center gap-2">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}