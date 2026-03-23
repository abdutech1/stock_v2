"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Target, Zap, Gift } from "lucide-react";
import api from '../../api/axios'
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export function BonusRuleManager() {
  const queryClient = useQueryClient();
  const { data: rules = [] } = useQuery({ queryKey: ["bonus-rules"], queryFn: () => api.get("/bonus-rules").then(res => res.data) });

  const deactivateMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/bonus-rules/${id}/deactivate`),
    onSuccess: () => {
      toast.success("Rule deactivated");
      queryClient.invalidateQueries({ queryKey: ["bonus-rules"] });
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Active Incentive Rules</h3>
        <button className="p-2 bg-indigo-600 text-white rounded-xl hover:scale-105 transition-transform">
          <Plus size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule: any) => (
          <div key={rule.id} className="bg-white border border-slate-100 p-5 rounded-[24px] shadow-sm flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-2xl",
                rule.type === "PERIOD_TOTAL" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
              )}>
                {rule.type === "PERIOD_TOTAL" ? <Target size={20}/> : <Zap size={20}/>}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">{rule.type.replace('_', ' ')}</p>
                <p className="font-black text-slate-900">
                   {rule.minAmount > 0 ? `Above ${rule.minAmount} ETB` : "Global Bonus"}
                </p>
                <p className="text-xs font-bold text-indigo-600">Reward: +{rule.bonusAmount} ETB</p>
              </div>
            </div>
            <button 
              onClick={() => deactivateMutation.mutate(rule.id)}
              className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}