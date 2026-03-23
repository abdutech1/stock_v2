

"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Banknote, TrendingUp, Loader2, Plus, 
  Search, Trash2, FileText, AlertTriangle, X
} from "lucide-react";
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  startOfYear, endOfYear, isWithinInterval 
} from "date-fns";
import { cn } from "@/lib/utils"; 
import toast from "react-hot-toast";
import { salaryService } from "@/services/salaryService";
import { PaySalaryModal } from "@/components/salary/PaySalaryModal"; 

export default function PayrollPage() {
  const queryClient = useQueryClient();
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [activePeriod, setActivePeriod] = useState<"ALL" | "WEEK" | "MONTH" | "YEAR">("MONTH");
  const [searchQuery, setSearchQuery] = useState("");
  
  // State for Graceful Delete Confirmation
  const [deleteTarget, setDeleteTarget] = useState<{id: number, name: string} | null>(null);

  const { data: salaries = [], isLoading } = useQuery({
    queryKey: ["salaries"],
    queryFn: salaryService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => salaryService.delete(id),
    onSuccess: () => {
      toast.success("Salary record permanently removed");
      queryClient.invalidateQueries({ queryKey: ["salaries"] });
      setDeleteTarget(null);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Delete failed";
      toast.error(msg);
    }
  });

  const filteredSalaries = useMemo(() => {
    const now = new Date();
    let interval = { start: new Date(0), end: new Date(2100, 0) };
    if (activePeriod === "WEEK") interval = { start: startOfWeek(now), end: endOfWeek(now) };
    if (activePeriod === "MONTH") interval = { start: startOfMonth(now), end: endOfMonth(now) };
    if (activePeriod === "YEAR") interval = { start: startOfYear(now), end: endOfYear(now) };

    return salaries.filter((s: any) => {
      const matchesDate = activePeriod === "ALL" || isWithinInterval(new Date(s.createdAt), interval);
      return matchesDate && s.user?.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [salaries, activePeriod, searchQuery]);

  const totalOutflow = useMemo(() => 
    filteredSalaries.reduce((sum: number, s: any) => sum + (s.amount || 0), 0)
  , [filteredSalaries]);

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
      {isPayModalOpen && <PaySalaryModal onClose={() => setIsPayModalOpen(false)} />}
      
      {/* --- GRACEFUL DELETE MODAL --- */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-6">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Confirm Revoke</h3>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              You are about to delete the salary record for <span className="text-slate-900 font-bold">{deleteTarget.name}</span>. This cannot be undone.
            </p>
            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => deleteMutation.mutate(deleteTarget.id)}
                disabled={deleteMutation.isPending}
                className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase bg-rose-500 text-white shadow-lg shadow-rose-100 hover:bg-rose-600 transition-all flex justify-center items-center"
              >
                {deleteMutation.isPending ? <Loader2 className="animate-spin" size={16}/> : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">
            Payroll <span className="text-indigo-600">Ledger</span>
          </h1>
          <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
            {["ALL", "WEEK", "MONTH", "YEAR"].map((p: any) => (
              <button
                key={p}
                onClick={() => setActivePeriod(p)}
                className={cn(
                  "px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all",
                  activePeriod === p ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        
        <button 
          onClick={() => setIsPayModalOpen(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-[24px] font-black text-xs uppercase hover:bg-indigo-600 transition-all flex items-center gap-3 shadow-xl"
        >
          <Plus size={18}/> Process Salary
        </button>
      </div>

      {/* Stats & Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden md:col-span-2">
          <TrendingUp className="absolute right-[-10px] bottom-[-10px] size-48 opacity-10" />
          <p className="text-xs font-bold uppercase opacity-60 tracking-widest">Total Outflow ({activePeriod})</p>
          <h2 className="text-5xl font-black mt-2 italic tabular-nums">
            {totalOutflow.toLocaleString()} <span className="text-sm font-normal">ETB</span>
          </h2>
        </div>

        <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm flex flex-col justify-between">
           <div className="space-y-2">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Search Staff</p>
              <div className="relative">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  type="text" 
                  placeholder="Type a name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 py-2 text-xl font-bold text-slate-900 outline-none placeholder:text-slate-200 bg-transparent"
                />
              </div>
           </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-[40px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
              <tr>
                <th className="px-8 py-6">Staff Member</th>
                <th className="px-8 py-6">Period Covered</th>
                <th className="px-8 py-6">Net Amount</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600" /></td></tr>
              ) : filteredSalaries.map((pay: any) => (
                <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center font-black text-xs">
                        {pay.user?.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 uppercase text-xs tracking-tight">{pay.user?.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">{pay.user?.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase bg-slate-100 px-3 py-1 rounded-lg">
                      {format(new Date(pay.periodStart), "MMM d")} - {format(new Date(pay.periodEnd), "MMM d")}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-black text-slate-900 italic tabular-nums">
                    {pay.amount?.toLocaleString()} <span className="text-[10px] not-italic text-slate-400 font-normal">ETB</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => setDeleteTarget({id: pay.id, name: pay.user?.name})}
                      className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}