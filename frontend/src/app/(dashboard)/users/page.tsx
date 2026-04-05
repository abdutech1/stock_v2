"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/api/axios";
import {
  Plus,
  Users as UsersIcon,
  UserCheck,
  UserX,
  X,
  Phone,
  User,
  Loader2,
  Edit3,
  RefreshCw,
  KeyRound,
  Search,
  CheckCircle2, 
  Copy
} from "lucide-react";

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deactivateEmployee,
  activateEmployee,
  transferEmployee,
} from "@/api/users.api";
import { getBranches } from "@/api/branches.api";
import { useAuth } from "@/hooks/useAuth";
import { useApp } from "@/context/AppContext";
import Protected from "@/components/Protected";

// --- Translations ---
const content = {
  en: {
    title: "Team Management",
    sub: "Add, update and monitor your staff.",
    addBtn: "Add New Staff",
    total: "Total Staff",
    active: "Active",
    inactive: "Inactive",
    name: "Full Name",
    phone: "Phone Number",
    branch: "Assign Branch",
    role: "Branch Role",
    salary: "Base Salary",
    cancel: "Cancel",
    create: "Create Account",
    update: "Update Account",
    status: "Status",
    actions: "Actions",
    salaryUnit: "ETB",
    loading: "Loading Team Data...",
    noData: "No staff members found.",
    selectBranch: "Select a Branch",
    activeEmployees: "Active Staff",
    archived: "Archived",
    transferTitle: "Transfer Employee",
    transferSub: "Move staff to a different location",
    confirmTransfer: "Confirm Transfer",
    resetPasswordTitle: "Reset Password",
    resetPasswordConfirm: "Are you sure you want to reset password for",
    resetting: "Resetting...",
    passwordGenerated: "New Password",
    copied: "Copied to clipboard",
  },
  am: {
    title: "የሰራተኞች አስተዳደር",
    sub: "አዲስ ሰራተኛ ይጨምሩ ወይም ያስተካክሉ።",
    addBtn: "አዲስ ሰራተኛ ጨምር",
    total: "ጠቅላላ ሰራተኞች",
    active: "ንቁ",
    inactive: "ያልተገበሩ",
    name: "ሙሉ ስም",
    phone: "ስልክ ቁጥር",
    branch: "ቅርንጫፍ ይምረጡ",
    role: "የስራ ድርሻ",
    salary: "መነሻ ደመወዝ",
    cancel: "ተመለስ",
    create: "መለያ ፍጠር",
    update: "መለያ አድስ",
    status: "ሁኔታ",
    actions: "ተግባራት",
    salaryUnit: "ብር",
    loading: "የሰራተኞች መረጃ በመጫን ላይ...",
    noData: "ምንም ሰራተኛ አልተገኘም።",
    selectBranch: "ቅርንጫፍ ይምረጡ",
    activeEmployees: "ንቁ ሰራተኞች",
    archived: "የተቀነሱ",
    transferTitle: "ሰራተኛ ማዛወር",
    transferSub: "ሰራተኛ ወደ ሌላ ቅርንጫፍ ይቀይሩ",
    confirmTransfer: "ማዛወሪያውን አጽድቅ",
    resetPasswordTitle: "የይለፍ ቃል ቀይር",
    resetPasswordConfirm: "ለዚህ ሰራተኛ የይለፍ ቃል ለመቀየር እርግጠኛ ኖት",
    resetting: "በመቀየር ላይ...",
    passwordGenerated: "አዲሱ የይለፍ ቃል",
    copied: "ኮፒ ተደርጓል",
  },
};

export default function UsersPage() {
  const { activeBranchId, language } = useApp();
  const t = content[language as keyof typeof content];
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [transferTarget, setTransferTarget] = useState<any | null>(null);

  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    branchRole: "CASHIER" as "CASHIER" | "MANAGER" | "STOCK_KEEPER",
    baseSalary: 0,
  });

   const [confirmConfig, setConfirmConfig] = useState<{
      isOpen: boolean;
      onConfirm: () => void;
      title: string;
      description: string;
      variant?: "default" | "destructive";
    }>({ isOpen: false, onConfirm: () => {}, title: "", description: "" });

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
const [successData, setSuccessData] = useState<any>(null);

  // --- Queries ---

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees", activeBranchId],
    queryFn: () => getEmployees(activeBranchId as number),
    enabled: !!activeBranchId,
    select: (response: any) => response.data || [],
  });

  const { data: branches = [] } = useQuery({
    queryKey: ["branches"],
    queryFn: getBranches,
    select: (response: any) => response.data || [],
  });

  const { data: branchList = [] } = useQuery({
    queryKey: ["my-branches"],
    queryFn: async () => {
      const res = await api.get("/auth/my-branches");
      // Based on your JSON provided: res.data.data.branches
      return res.data.data.branches;
    },
    // Ensure this runs for the Admin
    enabled: true,
  });

  const displayUsers = employees.filter((emp: any) => {
    const matchesTab = activeTab === "active" ? emp.isActive : !emp.isActive;
    if (filter === "ALL") return matchesTab;
    if (filter === "ACTIVE") return matchesTab && emp.isActive;
    if (filter === "INACTIVE") return matchesTab && !emp.isActive;
    return matchesTab;
  });

  // --- Mutations ---
 

 const submitMutation = useMutation({
  mutationFn: (data: any) =>
    editingId ? updateEmployee(editingId, data) : createEmployee(data),
  onSuccess: (res) => {
  queryClient.invalidateQueries({ queryKey: ["employees"] });
  
  if (!editingId) {
    
    const employee = res.data; 

    setSuccessData({
      ...employee,
      tempPassword: "Password123!"
    }); 
    
    setIsSuccessModalOpen(true);
  } else {
    toast.success(language === "en" ? "Updated Successfully" : "ተሳክቷል");
  }
  
  closeModal();
},
  onError: (err: any) => {
    toast.error(err.response?.data?.message || "Error creating user");
  },
});

  const statusMutation = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      active ? activateEmployee(id) : deactivateEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success(language === "en" ? "Status Updated" : "ሁኔታው ተቀይሯል");
    },
  });

  const transferMutation = useMutation({
    mutationFn: (data: { id: number; newBranchId: number; newRole: string }) =>
      transferEmployee(data.id, {
        newBranchId: data.newBranchId,
        newRole: data.newRole,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success(
        language === "en" ? "Employee Transferred" : "ሰራተኛው ተዘዋውሯል",
      );
      setTransferTarget(null);
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Transfer failed"),
  });

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      name: "",
      phoneNumber: "",
      branchRole: "CASHIER",
      baseSalary: 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBranchId)
      return toast.error(language === "en" ? "Select a branch" : "ቅርንጫፍ ይምረጡ");

    submitMutation.mutate({
      ...formData,
      branchId: Number(activeBranchId),
      baseSalary: Number(formData.baseSalary),
    });
  };

  const handleEdit = (employee: any) => {
    setEditingId(employee.id);
    setFormData({
      name: employee.name,
      phoneNumber: employee.phoneNumber,
      branchRole: employee.branches?.[0]?.role || "CASHIER",
      baseSalary: employee.baseSalary || 0,
    });
    setIsModalOpen(true);
  };

  return (
    <Protected requireRole="ORG_ADMIN">
      <div className="p-6 md:p-10 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {t.sub}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-4 bg-indigo-600 dark:bg-indigo-500 text-white font-bold rounded-[20px] flex items-center gap-2 hover:bg-indigo-700 dark:hover:bg-indigo-400 shadow-xl shadow-indigo-200 dark:shadow-none transition-all active:scale-95">
            <Plus size={20} /> {t.addBtn}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard
            label={t.total}
            count={employees.length}
            active={filter === "ALL"}
            onClick={() => setFilter("ALL")}
            icon={<UsersIcon />}
            color="indigo"
          />
          <StatCard
            label={t.active}
            count={employees.filter((e: any) => e.isActive).length}
            active={filter === "ACTIVE"}
            onClick={() => setFilter("ACTIVE")}
            icon={<UserCheck />}
            color="emerald"
          />
          <StatCard
            label={t.inactive}
            count={employees.filter((e: any) => !e.isActive).length}
            active={filter === "INACTIVE"}
            onClick={() => setFilter("INACTIVE")}
            icon={<UserX />}
            color="rose"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white dark:bg-slate-900 p-1.5 rounded-[24px] w-fit border border-slate-100 dark:border-slate-800 shadow-sm">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase transition-all ${activeTab === "active" ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-lg" : "text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
            {t.activeEmployees} (
            {employees.filter((e: any) => e.isActive).length})
          </button>
          <button
            onClick={() => setActiveTab("inactive")}
            className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase transition-all ${activeTab === "inactive" ? "bg-rose-600 text-white shadow-lg" : "text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
            {t.archived} ({employees.filter((e: any) => !e.isActive).length})
          </button>
        </div>

        {/* Table Content */}
        <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">
                  <th className="px-10 py-6 text-left">{t.name}</th>
                  <th className="px-10 py-6 text-left">{t.role}</th>
                  <th className="px-10 py-6 text-left">{t.salary}</th>
                  <th className="px-10 py-6 text-left">{t.status}</th>
                  <th className="px-10 py-6 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-20 text-center text-slate-400 font-black animate-pulse uppercase tracking-widest">
                      {t.loading}
                    </td>
                  </tr>
                ) : displayUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-20 text-center text-slate-400 font-black uppercase tracking-widest">
                      {t.noData}
                    </td>
                  </tr>
                ) : (
                  displayUsers.map((emp: any) => (
                    <tr
                      key={emp.id}
                      className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-10 py-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[18px] bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-lg transition-transform group-hover:scale-110">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 dark:text-white uppercase leading-none mb-1">
                            {emp.name}
                          </p>
                          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                            {emp.phoneNumber}
                          </p>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                            {emp.branches?.[0]?.role || "STAFF"}
                          </span>
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase">
                            {emp.branches?.[0]?.branch?.name || "Global"}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-6 font-black text-slate-700 dark:text-slate-300 tabular-nums">
                        {Number(emp.baseSalary || 0).toLocaleString()}{" "}
                        <span className="text-[10px] ml-1 text-slate-400 uppercase">
                          {t.salaryUnit}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${emp.isActive ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400"}`}>
                          {emp.isActive ? t.active : t.inactive}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex justify-end items-center gap-3">
                          <button
                            onClick={() =>
                              setConfirmConfig({
                                isOpen: true,
                                title:
                                  t.resetPasswordTitle || "Reset Password?",
                                description: `${t.resetPasswordConfirm} ${emp.name}?`,
                                onConfirm: () => {
                                  toast.promise(
                                    api.post("/auth/reset-password", {
                                      employeeId: emp.id,
                                    }),
                                    {
                                      loading: t.resetting || "Resetting...",
                                      success: (res) => {
                                        const pwd = res.data.data.tempPassword;
                                        navigator.clipboard.writeText(pwd);
                                        return `${t.passwordGenerated}: ${pwd} (${t.copied})`;
                                      },
                                      error: (err) =>
                                        err.response?.data?.message ||
                                        "Failed to reset",
                                    },
                                    {
                                      duration: 10000, // Longer duration so they can read/copy
                                      style: { minWidth: "300px" },
                                    },
                                  );
                                },
                              })
                            }
                            className="p-3 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-2xl transition-all"
                            title="Reset Password">
                            <KeyRound size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(emp)}
                            className="p-3 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl transition-all">
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() =>
                              statusMutation.mutate({
                                id: emp.id,
                                active: !emp.isActive,
                              })
                            }
                            className="p-3 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all">
                            {emp.isActive ? (
                              <UserX size={18} className="text-rose-500" />
                            ) : (
                              <UserCheck
                                size={18}
                                className="text-emerald-500"
                              />
                            )}
                          </button>
                          <button
                            onClick={() => setTransferTarget(emp)}
                            className="p-3 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-2xl transition-all">
                            <RefreshCw size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- MODALS --- */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                onClick={closeModal}
              />
              <motion.div
                initial={{ y: 50, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 50, opacity: 0, scale: 0.9 }}
                className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[48px] p-10 shadow-2xl overflow-y-auto max-h-[90vh] border border-white/10">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {editingId ? t.update : t.create}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:scale-110 transition-transform">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <InputField
                    label={t.name}
                    icon={<User size={18} />}
                    value={formData.name}
                    onChange={(v: string) =>
                      setFormData({ ...formData, name: v })
                    }
                  />
                  <InputField
                    label={t.phone}
                    icon={<Phone size={18} />}
                    value={formData.phoneNumber}
                    onChange={(v: string) =>
                      setFormData({ ...formData, phoneNumber: v })
                    }
                  />

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-3 block ml-1">
                      {t.role}
                    </label>
                    <select
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[20px] py-4 px-6 text-sm font-bold outline-none ring-1 ring-slate-100 dark:ring-slate-800 focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all appearance-none"
                      value={formData.branchRole}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branchRole: e.target.value as any,
                        })
                      }>
                      <option value="CASHIER">CASHIER</option>
                      <option value="MANAGER">MANAGER</option>
                      <option value="STOCK_KEEPER">STOCK KEEPER</option>
                    </select>
                  </div>

                  <InputField
                    label={t.salary}
                    type="number"
                    icon={<span className="text-[10px] font-black">ETB</span>}
                    value={formData.baseSalary}
                    onChange={(v: string) =>
                      setFormData({ ...formData, baseSalary: Number(v) })
                    }
                  />

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 py-5 text-slate-400 dark:text-slate-500 font-black uppercase text-[11px] tracking-widest">
                      {t.cancel}
                    </button>
                    <button
                      type="submit"
                      disabled={submitMutation.isPending}
                      className="flex-[2] py-5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-[24px] font-black uppercase text-[11px] tracking-widest shadow-xl shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-3">
                      {submitMutation.isPending && (
                        <Loader2 size={16} className="animate-spin" />
                      )}
                      {editingId ? t.update : t.create}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

          {transferTarget && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                onClick={() => setTransferTarget(null)}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[48px] p-10 shadow-2xl border border-white/10">
                <h2 className="text-2xl font-black uppercase mb-2 text-slate-900 dark:text-white tracking-tight">
                  {t.transferTitle}
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-8 font-bold uppercase tracking-widest">
                  {t.transferSub}:{" "}
                  <span className="text-indigo-500">{transferTarget.name}</span>
                </p>

                <div className="space-y-6">
                  {/* --- Transfer Modal Select --- */}
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-3 block">
                      {t.branch}
                    </label>
                    <select
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[20px] py-4 px-6 text-sm font-bold dark:text-white ring-1 ring-slate-100 dark:ring-slate-800 outline-none focus:ring-2 focus:ring-amber-500 transition-all appearance-none"
                      id="transferBranch">
                      {/* Change 'branches' to 'branchList' */}
                      {branchList.length > 0 ? (
                        branchList.map((b: any) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No branches available</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-3 block">
                      {t.role}
                    </label>
                    <select
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[20px] py-4 px-6 text-sm font-bold dark:text-white ring-1 ring-slate-100 dark:ring-slate-800 outline-none focus:ring-2 focus:ring-amber-500 transition-all appearance-none"
                      id="transferRole">
                      <option value="CASHIER">CASHIER</option>
                      <option value="MANAGER">MANAGER</option>
                      <option value="STOCK_KEEPER">STOCK KEEPER</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      const bId = (
                        document.getElementById(
                          "transferBranch",
                        ) as HTMLSelectElement
                      ).value;
                      const role = (
                        document.getElementById(
                          "transferRole",
                        ) as HTMLSelectElement
                      ).value;
                      transferMutation.mutate({
                        id: transferTarget.id,
                        newBranchId: Number(bId),
                        newRole: role,
                      });
                    }}
                    disabled={transferMutation.isPending}
                    className="w-full py-5 bg-amber-500 text-white rounded-[24px] font-black uppercase text-[11px] tracking-widest shadow-xl shadow-amber-100 dark:shadow-none hover:bg-amber-600 transition-all flex items-center justify-center gap-2">
                    {transferMutation.isPending && (
                      <Loader2 size={16} className="animate-spin" />
                    )}
                    {t.confirmTransfer}
                  </button>
                </div>
              </motion.div>
            </div>
          )}


          {isSuccessModalOpen && successData && (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={() => setIsSuccessModalOpen(false)}
      />
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] shadow-2xl p-10 border border-emerald-500/20 text-center overflow-hidden"
      >
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>

        <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-2">
          {language === "en" ? "Staff Created" : "ሰራተኛ ተመዝግቧል"}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold mb-8 uppercase tracking-widest">
          Account for <span className="text-indigo-500">{successData.name}</span> is ready.
        </p>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[32px] p-6 mb-8 border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-[0.2em] text-left ml-2">
            Login Credentials
          </p>

          <div className="space-y-3">
            {/* Phone Number Display */}
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="text-left">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Phone Number</p>
                <p className="text-sm font-bold dark:text-white tabular-nums">{successData.phoneNumber}</p>
              </div>
            </div>

            {/* Password Display with Copy */}
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="text-left">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Initial Password</p>
                <p className="text-sm font-mono font-black text-indigo-600 dark:text-indigo-400">
                   {/* Fallback to 123456 if your API doesn't return a dynamic one */}
                  {successData.tempPassword || "123456"}
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(successData.tempPassword || "123456");
                  toast.success(language === "en" ? "Copied!" : "ኮፒ ተደርጓል");
                }}
                className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:scale-110 p-3 rounded-xl transition-transform"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsSuccessModalOpen(false)}
          className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase text-[11px] tracking-[0.3em] rounded-[24px] hover:shadow-xl transition-all active:scale-95"
        >
          {language === "en" ? "Done" : "ተረድቻለሁ"}
        </button>
      </motion.div>
    </div>
  )}
        </AnimatePresence>

        {/* --- Generic Confirmation Modal --- */}
{confirmConfig.isOpen && (
  <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
      onClick={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
    />
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-[32px] p-8 shadow-2xl border border-slate-200 dark:border-slate-800"
    >
      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-2">
        {confirmConfig.title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 font-medium">
        {confirmConfig.description}
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
          className="flex-1 py-4 text-slate-500 font-bold uppercase text-[10px] tracking-widest"
        >
          {t.cancel}
        </button>
        <button
          onClick={() => {
            confirmConfig.onConfirm();
            setConfirmConfig({ ...confirmConfig, isOpen: false });
          }}
          className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg"
        >
          Confirm
        </button>
      </div>
    </motion.div>
  </div>
)}
      </div>
    </Protected>
  );
}

// Support Components
function StatCard({ label, count, active, onClick, icon, color }: any) {
  const colors: any = {
    indigo: "text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20",
    emerald: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
    rose: "text-rose-500 bg-rose-50 dark:bg-rose-900/20",
  };
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={`p-8 rounded-[36px] border cursor-pointer transition-all duration-300 ${active ? "bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-500/50 shadow-2xl shadow-indigo-100 dark:shadow-none" : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-slate-700"}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">
            {label}
          </p>
          <p className="text-4xl font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">
            {count}
          </p>
        </div>
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function InputField({ label, icon, value, onChange, type = "text" }: any) {
  return (
    <div>
      <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-3 block ml-1 tracking-widest">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors">
          {icon}
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-[20px] py-4.5 pl-14 pr-6 text-sm font-bold outline-none ring-1 ring-slate-100 dark:ring-slate-800 focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all focus:bg-white dark:focus:bg-slate-800"
        />
      </div>
    </div>
  );
}
