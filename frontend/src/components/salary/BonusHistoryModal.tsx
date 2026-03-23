// src/components/salary/BonusHistoryModal.tsx
import { useQuery } from "@tanstack/react-query";
import { X, Award, Calendar } from "lucide-react";
import { format } from "date-fns";
import api from "@/api/axios";

export function BonusHistoryModal({ onClose }: { onClose: () => void }) {
  const { data: bonuses = [], isLoading } = useQuery({
    queryKey: ["bonus-payments"],
    queryFn: () => api.get("/bonuses").then(res => res.data)
  });

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-indigo-600 text-white">
          <div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Payout History</h2>
            <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Recent bonus distributions</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors"><X/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {isLoading ? (
            <div className="text-center py-10 font-black text-slate-400 uppercase">Loading records...</div>
          ) : bonuses.map((b: any) => (
            <div key={b.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600">
                  <Award size={20}/>
                </div>
                <div>
                  <p className="font-black text-slate-900 text-xs uppercase">{b.user.name}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">{b.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-indigo-600 italic">+{b.amount} ETB</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                   <Calendar size={10}/> {format(new Date(b.createdAt), "MMM d, yyyy")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}