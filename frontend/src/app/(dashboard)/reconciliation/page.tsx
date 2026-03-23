
"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { cn } from "@/lib/utils";
import { 
  RefreshCcw, MoreVertical, Calendar as CalendarIcon,
  ArrowRight, Banknote, CreditCard, Trash2, CheckCircle2
} from "lucide-react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";

export default function DailyReconciliation() {
  const queryClient = useQueryClient();
  
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [selectedSales, setSelectedSales] = useState<number[]>([]);
  const [saleToDelete, setSaleToDelete] = useState<number | null>(null);

  const [topLimit, setTopLimit] = useState(5);

  // --- Data Fetching ---
  const { data, isLoading } = useQuery({
    queryKey: ["sales-report", startDate, endDate, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        startDate, endDate,
        includePaymentBreakdown: "true",
        limit: "100",
        ...(statusFilter && { status: statusFilter }),
      });
      const res = await api.get(`/reports/sales?${params.toString()}`);
      return res.data.data;
    },
  });

  const sales = data?.sales || [];

  // --- Calculations ---
  const stats = useMemo(() => {
    const bankTotals: Record<string, number> = {};
    let totalCash = 0;
    let revenue = 0;

    sales.forEach((sale: any) => {
      revenue += sale.itemsTotal || 0;
      sale.payments?.forEach((p: any) => {
        if (p.method === "CASH") {
          totalCash += p.amount || 0;
        } else {
          const name = p.bankName || p.method || "Other";
          bankTotals[name] = (bankTotals[name] || 0) + (p.amount || 0);
        }
      });
    });

    const bankList = Object.entries(bankTotals).map(([name, total]) => ({ name, total }));
    const totalDigital = bankList.reduce((acc, curr) => acc + curr.total, 0);
    const drafts = sales.filter((s: any) => s.status === "DRAFT").length;

    return { cash: totalCash, bankList, totalDigital, drafts, total: revenue };
  }, [sales]);

  // --- Mutations ---

  // 1. Single Confirmation
  const confirmSaleMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/sales/${id}/confirm`),
    onSuccess: () => {
      toast.success("Transaction finalized");
      queryClient.invalidateQueries({ queryKey: ["sales-report"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Action failed"),
  });

  // 2. Bulk Confirmation
  const confirmBulkMutation = useMutation({
    mutationFn: (ids: number[]) => api.patch("/sales/confirm/bulk", { saleIds: ids }),
    onSuccess: () => {
      toast.success(`${selectedSales.length} transactions finalized`);
      setSelectedSales([]);
      queryClient.invalidateQueries({ queryKey: ["sales-report"] });
    },
    onError: (err: any) => toast.error("Bulk update failed"),
  });

  // 3. Delete Draft
  const deleteDraftMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/sales/${id}`),
    onSuccess: () => {
      toast.success("Draft deleted");
      setSaleToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["sales-report"] });
    },
  });

  // --- Helpers ---
  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      const draftIds = sales.filter((s: any) => s.status === "DRAFT").map((s: any) => s.saleId);
      setSelectedSales(draftIds);
    } else {
      setSelectedSales([]);
    }
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedSales(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const analytics = useMemo(() => {
  // 1. Top Individual Sales
  const topSales = [...sales]
    .sort((a, b) => (b.itemsTotal || 0) - (a.itemsTotal || 0))
    .slice(0, topLimit);

  // 2. Employee Performance (Total Sold)
  const employeeMap: Record<string, { name: string; total: number; count: number }> = {};
  sales.forEach((sale: any) => {
    const empName = sale.employee?.name || "System";
    if (!employeeMap[empName]) {
      employeeMap[empName] = { name: empName, total: 0, count: 0 };
    }
    employeeMap[empName].total += sale.itemsTotal || 0;
    employeeMap[empName].count += 1;
  });

  const topEmployees = Object.values(employeeMap).sort((a, b) => b.total - a.total);

  return { topSales, topEmployees };
}, [sales, topLimit]);


  if (isLoading) return (
    <div className="p-8 flex flex-col items-center justify-center min-h-screen bg-slate-950 text-indigo-500">
      <RefreshCcw className="animate-spin mb-4" size={32} />
      <span className="text-[10px] font-black uppercase tracking-widest">Syncing Logs...</span>
    </div>
  );

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6 bg-slate-950 min-h-screen text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-2">
            <span className="w-1.5 h-6 bg-indigo-500 rounded-full" /> Audit & Recon
          </h1>
          <p className="text-slate-500 text-[10px] font-bold tracking-[0.2em]">DAILY OPERATIONAL OVERSIGHT</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-xl">
          <CalendarIcon size={12} className="text-indigo-400 ml-1" />
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent text-[10px] font-black focus:outline-none" />
          <ArrowRight size={10} className="text-slate-600" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent text-[10px] font-black focus:outline-none" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-2xl">
          <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Physical Cash</p>
          <p className="text-2xl font-black text-emerald-400">{stats.cash.toLocaleString()} <span className="text-xs">ETB</span></p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-2xl">
          <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Digital / Bank Breakdown</p>
          <div className="space-y-1.5 mb-2">
            {stats.bankList.map((bank, i) => (
              <div key={i} className="flex justify-between text-[11px]">
                <span className="font-bold text-slate-400 uppercase">{bank.name}</span>
                <span className="font-black text-blue-400">{bank.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <span className="text-[9px] font-black text-slate-500 uppercase">Bank Total</span>
            <span className="text-sm font-black text-white">{stats.totalDigital.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-2xl">
          <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Draft Count</p>
          <p className="text-2xl font-black text-amber-500">{stats.drafts}</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-2xl">
          <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Total Revenue</p>
          <p className="text-2xl font-black text-white">{stats.total.toLocaleString()} <span className="text-xs">ETB</span></p>
        </div>
      </div>


      {/* Leaderboard Section */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Top Sales Leaderboard */}
  <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 backdrop-blur-sm relative overflow-hidden">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400">High-Ticket Sales</h3>
        <p className="text-[10px] text-slate-500 font-bold">TOP INDIVIDUAL TRANSACTIONS</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-7 text-[10px] font-black border-slate-700 bg-slate-800 text-slate-300">
            TOP {topLimit} <MoreVertical size={12} className="ml-1"/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-slate-900 border-slate-800 text-slate-100">
          {[3, 5, 10, 15].map(num => (
            <DropdownMenuItem key={num} onClick={() => setTopLimit(num)} className="text-[10px] font-bold uppercase">
              Show Top {num}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <div className="space-y-3">
      {analytics.topSales.map((sale, idx) => (
        <div key={sale.saleId} className="group flex items-center justify-between p-3 rounded-2xl bg-slate-950/50 border border-slate-800/50 hover:border-indigo-500/50 transition-all">
          <div className="flex items-center gap-4">
            <span className={cn(
              "flex items-center justify-center w-6 h-6 rounded-lg text-[10px] font-black",
              idx === 0 ? "bg-amber-500/20 text-amber-500" : "bg-slate-800 text-slate-500"
            )}>
              #{idx + 1}
            </span>
            <div>
              <p className="text-xs font-black text-slate-200 uppercase truncate max-w-[150px]">
                {sale.items?.[0]?.categoryName || "Sale"} {sale.items?.length > 1 && `+${sale.items.length - 1}`}
              </p>
              <p className="text-[9px] text-slate-500 font-bold uppercase">{sale.employee?.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-white italic">{sale.itemsTotal.toLocaleString()} <span className="text-[10px] not-italic text-slate-500">ETB</span></p>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Employee Performance Leaderboard */}
  <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 backdrop-blur-sm">
    <div className="mb-6">
      <h3 className="text-sm font-black uppercase tracking-widest text-emerald-400">Force Performance</h3>
      <p className="text-[10px] text-slate-500 font-bold">TOTAL REVENUE BY SELLER</p>
    </div>

    <div className="space-y-4">
      {analytics.topEmployees.map((emp, idx) => {
        // Calculate percentage for progress bar relative to the top seller
        const percentage = (emp.total / analytics.topEmployees[0].total) * 100;
        
        return (
          <div key={emp.name} className="space-y-1.5">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-500">0{idx + 1}</span>
                <span className="text-xs font-black uppercase text-slate-200">{emp.name}</span>
                <Badge variant="outline" className="text-[8px] h-4 border-slate-700 text-slate-400">{emp.count} Sales</Badge>
              </div>
              <p className="text-xs font-black text-emerald-400">{emp.total.toLocaleString()} <span className="text-[9px] text-slate-500 uppercase">ETB</span></p>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  </div>
</div>

      {/* Table Section */}
      <div className="bg-slate-900/30 border border-slate-800/50 rounded-3xl overflow-hidden backdrop-blur-md">
        <div className="p-4 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/20">
          <div className="flex gap-2">
            <Button onClick={() => setStatusFilter(undefined)} variant={!statusFilter ? "secondary" : "ghost"} className="text-[9px] h-7 px-4 rounded-lg uppercase font-black">All</Button>
            <Button onClick={() => setStatusFilter("DRAFT")} variant={statusFilter === "DRAFT" ? "secondary" : "ghost"} className="text-[9px] h-7 px-4 rounded-lg uppercase font-black text-amber-500">Drafts</Button>
          </div>
          
          {selectedSales.length > 0 && (
            <Button 
              onClick={() => confirmBulkMutation.mutate(selectedSales)}
              disabled={confirmBulkMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-500 text-[10px] font-black uppercase h-8 px-4 rounded-lg shadow-lg shadow-indigo-500/20"
            >
              {confirmBulkMutation.isPending ? "Processing..." : `Confirm ${selectedSales.length} Selected`}
            </Button>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-900/50">
              <TableRow className="border-slate-800">
                <TableHead className="w-12 pl-6">
                  <input 
                    type="checkbox" 
                    className="accent-indigo-500 cursor-pointer w-4 h-4" 
                    checked={selectedSales.length > 0 && selectedSales.length === sales.filter((s:any) => s.status === "DRAFT").length} 
                    onChange={(e) => toggleSelectAll(e.target.checked)} 
                  />
                </TableHead>
                <TableHead className="text-slate-500 font-black text-[10px] uppercase min-w-[300px]">Transaction Items</TableHead>
                <TableHead className="text-slate-500 font-black text-[10px] uppercase text-right pr-10 w-[250px]">Payment Breakdown</TableHead>
                <TableHead className="text-slate-500 font-black text-[10px] uppercase w-[120px]">Status</TableHead>
                <TableHead className="w-10 pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale: any) => {
                const isDraft = sale.status === "DRAFT";
                return (
                  <TableRow key={sale.saleId} className="border-slate-800/40 hover:bg-white/[0.02]">
                    <TableCell className="pl-6">
                      {isDraft && (
                        <input 
                          type="checkbox" 
                          className="accent-indigo-500 cursor-pointer w-4 h-4"
                          checked={selectedSales.includes(sale.saleId)}
                          onChange={() => handleCheckboxChange(sale.saleId)}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2 py-2">
                        <div className="flex flex-wrap gap-1.5">
                          {sale.items?.map((item: any, i: number) => (
                            <span key={i} className="text-[10px] font-black text-slate-200 bg-slate-800/80 px-2 py-1 rounded border border-slate-700/50">
                              {item.categoryName}-{item.soldPrice.toLocaleString()} × {item.quantity}
                            </span>
                          ))}
                        </div>
                        <span className="text-[9px] text-slate-500 font-bold uppercase italic">
                          By {sale.employee?.name || "System"} • {new Date(sale.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-10">
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="font-black text-sm text-white italic">{sale.itemsTotal.toLocaleString()}</span>
                        <div className="flex flex-col items-end gap-1">
                          {sale.payments.map((p: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950 border border-slate-800/50">
                              {p.method === "CASH" ? <Banknote size={10} className="text-emerald-500" /> : <CreditCard size={10} className="text-blue-500" />}
                              <span className="text-[9px] font-black text-slate-300 uppercase">
                                {p.bankName || p.method}: {p.amount.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("text-[9px] font-black px-2 py-0.5 border-none shadow-sm", isDraft ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500")}>
                        {sale.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-white transition-colors"><MoreVertical size={14}/></Button>
                        </DropdownMenuTrigger>
                        
                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200 w-48 rounded-xl shadow-2xl">
  {isDraft ? (
    <>
      <DropdownMenuItem 
        onClick={() => confirmSaleMutation.mutate(sale.saleId)}
        className="text-emerald-400 font-bold cursor-pointer"
      >
        <CheckCircle2 size={14} className="mr-2"/> Finalize Sale
      </DropdownMenuItem>
      
      <DropdownMenuItem 
        onClick={() => setSaleToDelete(sale.saleId)} 
        className="text-red-500 font-bold cursor-pointer"
      >
        <Trash2 size={14} className="mr-2"/> Delete Draft
      </DropdownMenuItem>
    </>
  ) : (
    <div className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
      Locked / Confirmed
    </div>
  )}
</DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Graceful Delete Dialog */}
      <AlertDialog open={saleToDelete !== null} onOpenChange={() => setSaleToDelete(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="uppercase font-black italic tracking-tighter text-2xl">Discard Draft?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Removing Transaction <span className="text-white font-bold">#{saleToDelete}</span> will restore items to stock. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-none text-white hover:bg-slate-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => saleToDelete && deleteDraftMutation.mutate(saleToDelete)} 
              className="bg-red-600 hover:bg-red-500 text-white font-bold"
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}