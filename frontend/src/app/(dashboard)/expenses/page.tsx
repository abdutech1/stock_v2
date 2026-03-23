"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseService, Expense } from "@/services/expenseService";
import { 
  Wallet, Plus, Trash2, Edit2, Check, X,
  ChevronLeft, ChevronRight, Loader2,
  TrendingDown, History, CalendarDays
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  format, startOfDay, endOfDay, 
  startOfWeek, endOfWeek, 
  startOfMonth, endOfMonth, 
  addDays, addWeeks, addMonths,
  subDays, subWeeks, subMonths,
  parseISO
} from "date-fns";
import toast from "react-hot-toast";

type ViewMode = "daily" | "weekly" | "monthly";
const CATEGORIES = ["Rent", "Utilities", "Salary", "Marketing", "Bonus", "General"];

export default function ExpensesPage() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<ViewMode>("weekly");
  const [referenceDate, setReferenceDate] = useState(new Date());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Expense>>({});
  const [activeCategory, setActiveCategory] = useState("All");
  
  const [form, setForm] = useState({ 
    description: "", 
    amount: "", 
    category: "General",
    expenseDate: format(new Date(), "yyyy-MM-dd")
  });

  const dateRange = useMemo(() => {
    let start, end;
    switch (viewMode) {
      case "daily":
        start = startOfDay(referenceDate);
        end = endOfDay(referenceDate);
        break;
      case "weekly":
        start = startOfWeek(referenceDate, { weekStartsOn: 1 });
        end = endOfWeek(referenceDate, { weekStartsOn: 1 });
        break;
      case "monthly":
        start = startOfMonth(referenceDate);
        end = endOfMonth(referenceDate);
        break;
    }
    return { 
      start: format(start, "yyyy-MM-dd"), 
      end: format(end, "yyyy-MM-dd"),
      label: viewMode === "daily" ? format(referenceDate, "EEE, MMM d, yyyy") : 
             viewMode === "monthly" ? format(referenceDate, "MMMM yyyy") :
             `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`
    };
  }, [referenceDate, viewMode]);

  const { data, isLoading } = useQuery({
    queryKey: ["expenses", dateRange.start, dateRange.end],
    queryFn: () => expenseService.list(dateRange.start, dateRange.end),
  });

  const filteredExpenses = useMemo(() => {
    if (!data?.data) return [];
    return activeCategory === "All" ? data.data : data.data.filter((e: Expense) => e.category === activeCategory);
  }, [data, activeCategory]);

  const createMutation = useMutation({
    mutationFn: expenseService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setForm(prev => ({ ...prev, description: "", amount: "" }));
      toast.success("Expense Recorded");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => expenseService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setEditingId(null);
      toast.success("Updated");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: expenseService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setConfirmDeleteId(null);
      toast.success("Deleted");
    },
  });

 const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;
    
   
    createMutation.mutate({
      ...form,
      amount: Number(form.amount),
      expenseDate: form.expenseDate 
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-6 bg-slate-50/50 min-h-screen">
      
      {/* 1. Enhanced Navigation Bar */}
      <div className="bg-white border border-slate-200 p-2 sm:p-3 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex bg-slate-100 p-1 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
          {(["daily", "weekly", "monthly"] as ViewMode[]).map((mode) => (
            <button 
              key={mode}
              onClick={() => { setViewMode(mode); setReferenceDate(new Date()); }}
              className={cn(
                "flex-1 min-w-[80px] px-4 py-2 text-[10px] font-black uppercase rounded-xl transition-all whitespace-nowrap",
                viewMode === mode ? "bg-white shadow text-indigo-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setReferenceDate(prev => viewMode === "daily" ? subDays(prev, 1) : viewMode === "weekly" ? subWeeks(prev, 1) : subMonths(prev, 1))} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><ChevronLeft size={20} /></button>
          <div className="text-center min-w-[120px]">
            <span className="text-sm font-black text-slate-900 tracking-tight">{dateRange.label}</span>
          </div>
          <button onClick={() => setReferenceDate(prev => viewMode === "daily" ? addDays(prev, 1) : viewMode === "weekly" ? addWeeks(prev, 1) : addMonths(prev, 1))} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><ChevronRight size={20} /></button>
        </div>

        <div className="flex items-center gap-4 px-6 py-2 md:py-0 bg-red-50 md:bg-transparent rounded-2xl w-full md:w-auto md:border-l md:border-slate-100 justify-between md:justify-end">
          <div className="md:text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Total Outflow</p>
            <p className="text-xl font-black text-red-600">{data?.summary?.totalAmount.toLocaleString() || 0} <span className="text-[10px] font-bold text-slate-400">ETB</span></p>
          </div>
          <TrendingDown className="text-red-500" size={24} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 2. Registration Card */}
        <div className="lg:col-span-4">
          <Card className="border-slate-200 shadow-xl lg:sticky lg:top-24 rounded-[2.5rem] overflow-hidden">
            <div className="h-2 bg-indigo-600 w-full" />
            <CardHeader className="pb-2">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-500">
                <Plus size={16} className="text-indigo-600"/> Quick Entry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Detail</label>
                  <input required value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="What was this for?" className="w-full p-4 bg-slate-50 border-slate-100 border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Amount</label>
                    <input type="number" required value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="0.00" className="w-full p-4 bg-slate-50 border-slate-100 border rounded-2xl text-sm outline-none focus:border-indigo-500 transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Type</label>
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-4 bg-slate-50 border-slate-100 border rounded-2xl text-sm outline-none focus:border-indigo-500 appearance-none">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Date</label>
                  <div className="relative">
                    <input type="date" value={form.expenseDate} onChange={e => setForm({...form, expenseDate: e.target.value})} className="w-full p-4 bg-slate-50 border-slate-100 border rounded-2xl text-sm outline-none focus:border-indigo-500 pr-12" />
                    <CalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                  </div>
                </div>
                <Button disabled={createMutation.isPending} className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-lg shadow-indigo-200 transition-all active:scale-95">
                  {createMutation.isPending ? <Loader2 className="animate-spin" /> : "Confirm Expense"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* 3. History List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center px-4">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <History size={14} className="text-indigo-600"/> Activity Log
            </h3>
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1 rounded-full">
               <span className="text-[9px] font-black text-slate-400 uppercase">Filter:</span>
               <select value={activeCategory} onChange={e => setActiveCategory(e.target.value)} className="text-[10px] font-black uppercase bg-transparent text-indigo-600 border-none focus:ring-0 cursor-pointer">
                <option value="All">All Transactions</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {isLoading ? <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-indigo-600" /></div> : 
              filteredExpenses.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No entries found for this period</p>
                </div>
              ) :
              filteredExpenses.map((exp: Expense) => (
              <div key={exp.id} className="bg-white border border-slate-100 p-4 sm:p-5 rounded-[2rem] hover:shadow-md transition-all group relative">
                <div className="flex items-start justify-between gap-4">
                  
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={cn(
                      "p-3 rounded-2xl transition-colors shrink-0",
                      exp.category === 'Bonus' ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                    )}>
                      <Wallet size={20} />
                    </div>
                    
                    {editingId === exp.id ? (
                      <div className="flex flex-col gap-2 w-full max-w-md">
                        <input className="p-2 border rounded-xl text-sm outline-none w-full" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} />
                        <div className="flex gap-2">
                          <input className="w-24 p-2 border rounded-xl text-sm outline-none" type="number" value={editForm.amount} onChange={e => setEditForm({...editForm, amount: Number(e.target.value)})} />
                          <select value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} className="p-2 border rounded-xl text-xs outline-none">
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="min-w-0">
                        <h4 className="font-black text-slate-900 truncate text-sm sm:text-base pr-4 italic tracking-tight">{exp.description}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className={cn(
                            "text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-tighter",
                            exp.category === 'Bonus' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                          )}>{exp.category}</span>
                          <span className="text-[10px] text-slate-400 font-bold">{format(parseISO(exp.expenseDate), "MMM d, yyyy")}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <p className="text-lg font-black text-slate-900 leading-none">-{exp.amount.toLocaleString()}</p>
                    <p className="text-[9px] font-black text-red-500 uppercase tracking-tighter mt-1">Birr</p>
                    
                    <div className="flex items-center gap-1 mt-3 group-hover:opacity-100 transition-opacity">
                      {editingId === exp.id ? (
                        <>
                          <button onClick={() => updateMutation.mutate({ id: exp.id, data: editForm })} className="p-2 text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"><Check size={16}/></button>
                          <button onClick={() => setEditingId(null)} className="p-2 text-slate-400 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"><X size={16}/></button>
                        </>
                      ) : confirmDeleteId === exp.id ? (
                        <div className="flex items-center gap-1 bg-red-50 p-1 rounded-xl">
                          <button onClick={() => deleteMutation.mutate(exp.id)} className="px-3 py-1 bg-red-600 text-white text-[9px] font-black rounded-lg uppercase">Delete</button>
                          <button onClick={() => setConfirmDeleteId(null)} className="p-1 text-slate-400"><X size={14}/></button>
                        </div>
                      ) : (
                        <>
                          <button onClick={() => { setEditingId(exp.id); setEditForm(exp); }} className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Edit2 size={16}/></button>
                          <button onClick={() => setConfirmDeleteId(exp.id)} className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16}/></button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}