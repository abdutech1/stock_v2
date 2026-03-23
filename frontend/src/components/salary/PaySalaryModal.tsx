"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Loader2, Banknote, ChevronRight, Info, AlertCircle } from "lucide-react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import toast from "react-hot-toast";
import { salaryService } from "@/services/salaryService";
import { getEmployees } from "@/api/users.api";

export function PaySalaryModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<"FORM" | "PREVIEW">("FORM");
  const [formData, setFormData] = useState({
    userId: "",
    rate: "",
    periodStart: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    periodEnd: format(endOfMonth(new Date()), "yyyy-MM-dd"),
  });

  const { data: employees = [] } = useQuery({ 
    queryKey: ["employees"], 
    queryFn: getEmployees 
  });

  const activeStaff = employees.filter((e: any) => e.isActive && e.role !== "OWNER");

  // --- PREVIEW MUTATION ---
  const previewMutation = useMutation({
    mutationFn: (params: any) => salaryService.preview(params),
    onSuccess: (data) => {
      // Logic Check: Even if API returns 200, check the 'canPay' flag from your backend logic
      if (data.canPay === false) {
        // This is your "Overlapping" or "No attendance" reason!
        toast.error(data.reason, { duration: 5000 });
      } else {
        setStep("PREVIEW");
      }
    },
    onError: (err: any) => {
      // If the backend throws a hard Error()
      const errorMsg = err.response?.data?.message || "Calculation failed";
      toast.error(errorMsg);
    }
  });

  // --- FINAL PAYMENT MUTATION ---
  const payMutation = useMutation({
    mutationFn: (payload: any) => salaryService.create(payload),
    onSuccess: () => {
      toast.success("Payment recorded successfully!");
      queryClient.invalidateQueries({ queryKey: ["salaries"] });
      onClose();
    },
    onError: (err: any) => {
      // This extracts the "Salary already paid for overlapping period..." from Prisma
      const errorMsg = err.response?.data?.message || "Payment execution failed";
      toast.error(errorMsg, {
        icon: '🚫',
        style: { borderRadius: '15px', background: '#333', color: '#fff' }
      });
    }
  });

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="p-8 pb-4 flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
            Payroll <span className="text-indigo-600">Portal</span>
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-8 pt-0">
          {step === "FORM" ? (
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              previewMutation.mutate({
                userId: Number(formData.userId),
                rate: Number(formData.rate),
                periodStart: new Date(formData.periodStart),
                periodEnd: new Date(formData.periodEnd),
              });
            }}>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Staff</label>
                <select 
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 rounded-2xl p-4 text-sm font-bold outline-none transition-all"
                  value={formData.userId}
                  onChange={(e) => setFormData({...formData, userId: e.target.value})}
                  required
                >
                  <option value="">Select Employee...</option>
                  {activeStaff.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Daily Rate (ETB)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 rounded-2xl p-4 text-sm font-bold outline-none"
                  value={formData.rate}
                  onChange={(e) => setFormData({...formData, rate: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input type="date" className="bg-slate-50 rounded-xl p-3 text-xs font-bold" value={formData.periodStart} onChange={(e)=>setFormData({...formData, periodStart: e.target.value})}/>
                <input type="date" className="bg-slate-50 rounded-xl p-3 text-xs font-bold" value={formData.periodEnd} onChange={(e)=>setFormData({...formData, periodEnd: e.target.value})}/>
              </div>

              <button disabled={previewMutation.isPending} className="w-full bg-slate-900 text-white p-5 rounded-3xl font-black text-[11px] uppercase hover:bg-indigo-600 transition-all flex justify-center items-center gap-2">
                {previewMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <>Generate Preview <ChevronRight size={16} /></>}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
                <p className="text-[10px] font-black uppercase opacity-60">Confirmed Payout</p>
                <h3 className="text-5xl font-black italic mt-1 tracking-tighter tabular-nums">
                  {previewMutation.data?.totalAmount?.toLocaleString()} 
                  <span className="text-sm ml-2 not-italic text-slate-400 font-normal">ETB</span>
                </h3>
                <div className="mt-6 flex gap-4 border-t border-white/10 pt-4">
                   <div className="text-[10px] font-bold uppercase opacity-50">Attendance: {previewMutation.data?.workedDays} Days</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep("FORM")} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-[10px] uppercase">Edit</button>
                <button 
                  onClick={() => payMutation.mutate({
                    ...formData,
                    userId: Number(formData.userId),
                    rate: Number(formData.rate),
                    amount: previewMutation.data?.totalAmount
                  })} 
                  disabled={payMutation.isPending}
                  className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg hover:bg-indigo-700 transition-all flex justify-center items-center gap-2"
                >
                  {payMutation.isPending ? <Loader2 className="animate-spin" size={16}/> : "Finalize Payment"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}