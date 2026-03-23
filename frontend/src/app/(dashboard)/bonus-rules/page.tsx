"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Award, Trash2, Loader2, Target, Coins, ShieldCheck } from "lucide-react";
import { bonusService } from "@/services/bonusService";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

// Matches your backend CreateBonusRuleInput
type BonusType = "PERIOD_TOTAL" | "SINGLE_SALE" | "GLOBAL";

export default function BonusRulesPage() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    type: "PERIOD_TOTAL" as BonusType,
    minAmount: "",
    bonusAmount: "",
  });

  // 1. Fetch Active Rules
  const { data: rules = [], isLoading } = useQuery({
    queryKey: ["bonus-rules"],
    queryFn: bonusService.getRules,
  });

  // 2. Create Rule Mutation (Matches your POST controller)
  const createMutation = useMutation({
    mutationFn: (data: any) => bonusService.createRule(data),
    onSuccess: () => {
      toast.success("Bonus logic updated successfully!");
      setIsAdding(false);
      setFormData({ type: "PERIOD_TOTAL", minAmount: "", bonusAmount: "" });
      queryClient.invalidateQueries({ queryKey: ["bonus-rules"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Check if this rule type already exists");
    }
  });

  // 3. Deactivate Mutation (Matches your PATCH /:id/deactivate)
  const deactivateMutation = useMutation({
    mutationFn: (id: number) => bonusService.deactivateRule(id),
    onSuccess: () => {
      toast.success("Rule disabled.");
      queryClient.invalidateQueries({ queryKey: ["bonus-rules"] });
    },
  });

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">
            Bonus <span className="text-indigo-600">Engine</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Configure automated payout logic</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-slate-900 text-white px-8 py-4 rounded-[24px] font-black text-xs uppercase hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-xl"
        >
          {isAdding ? "Close" : <><Plus size={16}/> New Rule</>}
        </button>
      </div>

      {/* FORM: Matches CreateBonusRuleInput */}
      {isAdding && (
        <div className="bg-white border-2 border-indigo-50 rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95">
          <form className="space-y-6" onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate({
              type: formData.type,
              minAmount: formData.type === "GLOBAL" ? 0 : Number(formData.minAmount),
              bonusAmount: Number(formData.bonusAmount)
            });
          }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Rule Type</label>
                <select 
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 rounded-2xl p-4 text-sm font-bold outline-none"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as BonusType})}
                >
                  <option value="PERIOD_TOTAL">Total Sales Target</option>
                  <option value="SINGLE_SALE">Big Single Sale</option>
                  <option value="GLOBAL">All Staff Bonus</option>
                </select>
              </div>

              {formData.type !== "GLOBAL" && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Min. Threshold (ETB)</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 rounded-2xl p-4 text-sm font-bold outline-none"
                    placeholder="e.g. 5000"
                    value={formData.minAmount}
                    onChange={(e) => setFormData({...formData, minAmount: e.target.value})}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Reward Amount (ETB)</label>
                <input 
                  type="number"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 rounded-2xl p-4 text-sm font-bold outline-none"
                  placeholder="e.g. 500"
                  value={formData.bonusAmount}
                  onChange={(e) => setFormData({...formData, bonusAmount: e.target.value})}
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={createMutation.isPending}
              className="w-full bg-indigo-600 text-white p-5 rounded-3xl font-black text-xs uppercase hover:bg-slate-900 transition-all flex justify-center items-center gap-2 shadow-lg"
            >
              {createMutation.isPending ? <Loader2 className="animate-spin" size={18}/> : "Deploy Rule"}
            </button>
          </form>
        </div>
      )}

      {/* LIST: Matches getActiveBonusRules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-2 py-20 flex justify-center"><Loader2 className="animate-spin text-slate-300" size={48}/></div>
        ) : rules.length === 0 ? (
          <div className="col-span-2 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] p-20 text-center">
             <ShieldCheck size={48} className="mx-auto text-slate-200 mb-4" />
             <p className="text-xs font-black text-slate-400 uppercase">No active rules found. Create one to start automating.</p>
          </div>
        ) : rules.map((rule: any) => (
          <div key={rule.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Award size={28} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 uppercase italic text-lg leading-tight">{rule.type.replace('_', ' ')}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em]">Active Engine</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => deactivateMutation.mutate(rule.id)}
                className="p-3 bg-slate-50 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                title="Deactivate Rule"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-3xl p-5">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-2 flex items-center gap-1">
                  <Target size={10}/> Requirement
                </p>
                <span className="font-black text-slate-700 text-sm">
                  {rule.minAmount > 0 ? `${rule.minAmount.toLocaleString()} ETB` : "None (Global)"}
                </span>
              </div>
              <div className="bg-indigo-600 rounded-3xl p-5 text-white shadow-lg shadow-indigo-100">
                <p className="text-[9px] font-black opacity-60 uppercase mb-2 flex items-center gap-1">
                  <Coins size={10}/> Payout
                </p>
                <span className="font-black text-lg">+{rule.bonusAmount.toLocaleString()} <span className="text-[10px]">ETB</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}