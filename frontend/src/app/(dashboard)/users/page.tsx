"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Users as UsersIcon, UserCheck, UserX, Copy, 
  Shield, Edit2, X, Phone, Banknote, User, AlertCircle, Loader2
} from "lucide-react";

import { 
  getEmployees, createEmployee, updateEmployee, 
  deactivateEmployee, activateEmployee, CreateEmployeeInput 
} from "@/api/users.api";
import { useAuth } from "@/hooks/useAuth";
import Protected from "@/components/Protected";

// --- Types ---
interface Employee extends CreateEmployeeInput {
  id: number;
  isActive: boolean;
  role: "OWNER" | "EMPLOYEE";
}

const ETHIOPIAN_PHONE_REGEX = /^(09|07)\d{8}$/;

export default function UsersPage() {
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { role } = useAuth();
  const queryClient = useQueryClient();

  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateEmployeeInput>({
    name: "",
    phoneNumber: "",
    baseSalary: 0,
  });

  // --- Handlers ---
  const handleEditClick = (emp: Employee) => {
    setEditingId(emp.id);
    setFormData({
      name: emp.name,
      phoneNumber: emp.phoneNumber,
      baseSalary: emp.baseSalary || 0,
    });
    setCreateError(null);
    setIsModalOpen(true);
  };

  const updateField = (field: keyof CreateEmployeeInput, value: string | number) => {
    setCreateError(null);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setCreateSuccess(null);
    setCreateError(null);
    setFormData({ name: "", phoneNumber: "", baseSalary: 0 });
  };

  // --- Queries ---
  const { data: employees = [], isLoading } = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: getEmployees,
    enabled: role === "OWNER",
  });

  const filteredEmployees = employees.filter((emp) => {
    if (filter === "ACTIVE") return emp.isActive;
    if (filter === "INACTIVE") return !emp.isActive;
    return true;
  });

  // --- Mutations ---
  const createMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setCreateSuccess("Employee created successfully!\nDefault password: 123456");
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "";
      if (msg.toLowerCase().includes("phonenumber") || msg.toLowerCase().includes("unique")) {
        setCreateError("This phone number is already registered.");
      } else {
        setCreateError(msg || "Failed to create staff member.");
      }
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateEmployeeInput }) => updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee updated");
      closeModal();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Update failed"),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) => 
      active ? activateEmployee(id) : deactivateEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Status updated");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Action failed"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ETHIOPIAN_PHONE_REGEX.test(formData.phoneNumber)) {
      setCreateError("Invalid format. Use 09... or 07... (10 digits)");
      return;
    }
    if (formData.name.length < 3) {
      setCreateError("Please enter a valid full name.");
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <Protected requireRole="OWNER">
      <div className="space-y-8 px-6 md:px-10 py-8 bg-slate-50/50 min-h-screen font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Team Management</h1>
            <p className="text-slate-500 font-medium">Add, update and monitor your boutique staff.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Plus size={20} /> Add New Staff
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard label="Total Staff" count={employees.length} active={filter === "ALL"} onClick={() => setFilter("ALL")} icon={<UsersIcon className="text-indigo-500" />} />
          <StatCard label="Active" count={employees.filter(e => e.isActive).length} active={filter === "ACTIVE"} onClick={() => setFilter("ACTIVE")} icon={<UserCheck className="text-emerald-500" />} />
          <StatCard label="On Leave" count={employees.filter(e => !e.isActive).length} active={filter === "INACTIVE"} onClick={() => setFilter("INACTIVE")} icon={<UserX className="text-rose-500" />} />
        </div>

        {/* Table Content */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  <th className="px-8 py-5 text-left">Employee</th>
                  <th className="px-8 py-5 text-left">Base Salary</th>
                  <th className="px-8 py-5 text-left">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr><td colSpan={4} className="p-20 text-center text-slate-400 font-bold">Loading Team Data...</td></tr>
                ) : filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-8 py-5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">{emp.name.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-black text-slate-900 uppercase leading-none mb-1">{emp.name}</p>
                        <p className="text-[11px] font-bold text-slate-400">{emp.phoneNumber}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-bold text-slate-700 tabular-nums">
                      {(emp.baseSalary ?? 0).toLocaleString()} <span className="text-[10px] text-slate-400">ETB</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${emp.isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                        {emp.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {emp.role === "OWNER" ? <Shield size={14} className="text-amber-500" /> : (
                          <>
                            <button onClick={() => handleEditClick(emp)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Edit2 size={18} /></button>
                            <button 
                              disabled={statusMutation.isPending}
                              onClick={() => statusMutation.mutate({ id: emp.id, active: !emp.isActive })} 
                              className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-30"
                            >
                              {statusMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : emp.isActive ? <UserX size={18} className="hover:text-rose-600" /> : <UserCheck size={18} className="hover:text-emerald-600" />}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={closeModal} />
              <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{editingId ? "Update Member" : "New Staff"}</h2>
                  <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
                </div>

                {createSuccess ? (
                  <SuccessState message={createSuccess} onCopy={() => { navigator.clipboard.writeText("123456"); toast.success("Copied!"); }} onDone={closeModal} />
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <InputField label="Full Name" icon={<User size={16}/>} value={formData.name} onChange={(v: string) => updateField("name", v)} />
                    <InputField label="Phone Number" icon={<Phone size={16}/>} placeholder="09..." value={formData.phoneNumber} onChange={(v: string) => updateField("phoneNumber", v)} />
                    <InputField label="Base Salary (ETB)" icon={<Banknote size={16}/>} type="number" value={formData.baseSalary ?? ""} onChange={(v: string) => updateField("baseSalary", Number(v))} />
                    
                    {createError && (
                      <motion.div initial={{ x: -10 }} animate={{ x: 0 }} className="flex items-center gap-2 p-4 bg-rose-50 rounded-2xl border border-rose-100 text-rose-600 text-[11px] font-bold">
                        <AlertCircle size={16} className="shrink-0" /> {createError}
                      </motion.div>
                    )}
                    
                    <div className="flex gap-3 pt-4">
                      <button type="button" onClick={closeModal} className="flex-1 py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest">Cancel</button>
                      <button 
                        disabled={createMutation.isPending || updateMutation.isPending} 
                        className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {(createMutation.isPending || updateMutation.isPending) && <Loader2 size={16} className="animate-spin" />}
                        {editingId ? "Update Account" : "Create Account"}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Protected>
  );
}

// --- Internal UI Components ---

interface StatCardProps { label: string; count: number; active: boolean; onClick: () => void; icon: React.ReactNode; }
function StatCard({ label, count, active, onClick, icon }: StatCardProps) {
  return (
    <div onClick={onClick} className={`p-6 rounded-[32px] border cursor-pointer transition-all active:scale-95 ${active ? "bg-white border-indigo-200 shadow-xl shadow-indigo-100/50" : "bg-white border-slate-100 hover:border-indigo-100"}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{label}</p>
          <p className="text-3xl font-black text-slate-900 tabular-nums">{count}</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">{icon}</div>
      </div>
    </div>
  );
}

interface InputFieldProps { label: string; icon: React.ReactNode; value: string | number | undefined; onChange: (val: string) => void; type?: string; placeholder?: string; }
function InputField({ label, icon, value, onChange, type = "text", placeholder = "" }: InputFieldProps) {
  return (
    <div>
      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">{icon}</div>
        <input 
          type={type} 
          value={value ?? ""} 
          placeholder={placeholder} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} 
          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all" 
        />
      </div>
    </div>
  );
}

function SuccessState({ message, onCopy, onDone }: { message: string; onCopy: () => void; onDone: () => void; }) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"><UserCheck size={40} /></div>
      <p className="text-slate-600 font-bold mb-8 whitespace-pre-line leading-relaxed">{message}</p>
      <button onClick={onCopy} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[11px] flex items-center justify-center gap-2 mb-3 shadow-lg shadow-emerald-100 active:scale-95 transition-all"><Copy size={16} /> Copy Password</button>
      <button onClick={onDone} className="w-full py-4 text-slate-400 font-black uppercase text-[11px] hover:text-slate-600 transition-colors">Dismiss</button>
    </div>
  );
}
