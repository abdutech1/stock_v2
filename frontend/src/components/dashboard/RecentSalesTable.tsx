


"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Receipt, Clock, ChevronRight, BadgeCheck, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface SaleItem {
  categoryName: string;
  quantity: number;
}

interface Payment {
  method: string;
  amount: number;
  bankName?: string;
}

interface Sale {
  saleId: number;
  createdAt: string;
  status: string;
  itemsTotal: number;
  employeeName: string;
  items: SaleItem[];
  payments: Payment[];
}

interface RecentSalesProps {
  sales: Sale[];
  period: string; // Passed from the Dashboard state
}

const periodLabels: Record<string, string> = {
  today: "Daily",
  thisWeek: "Weekly",
  thisMonth: "Monthly"
};



export function RecentSalesTable({ sales, period }: RecentSalesProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFullView = searchParams.get("full") === "true";

  if (!sales?.length) {
    return (
      <Card className="border-dashed border-slate-200 bg-slate-50/50">
        <CardContent className="flex flex-col items-center justify-center py-12 text-slate-400">
          <Receipt size={32} className="mb-2 opacity-20" />
          <p className="text-xs font-black uppercase tracking-widest">No Transactions for {periodLabels[period] || "this period"}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
      <CardHeader className="pb-4 border-b border-slate-50 flex flex-row items-center justify-between">
        <CardTitle className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-2">
          <div className="w-1.5 h-4 bg-indigo-600 rounded-full" />
          {periodLabels[period] || "Recent"} Activity Log
        </CardTitle>
        <Badge variant="outline" className="text-[9px] font-black border-slate-200 bg-slate-50 text-slate-500">
          Showing {sales.length} Sales
        </Badge>
      </CardHeader>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead className="bg-slate-50/80">
            <tr>
              <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Transaction / Items</th>
              <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">Amount</th>
              <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sales.map((sale) => (
              <tr key={sale.saleId} className="group hover:bg-indigo-50/30 transition-all cursor-default">
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap gap-1">
                      {sale.items?.map((item, i) => (
                        <span 
                          key={`${sale.saleId}-item-${i}`} 
                          className="inline-flex items-center text-[10px] font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm group-hover:border-indigo-200"
                        >
                          {item.categoryName} <span className="text-indigo-400 mx-1">×</span> {item.quantity}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase italic">
                      <Clock size={10} className="text-slate-300" />
                      {new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      <span className="text-slate-300">•</span>
                      <span>By {sale.employeeName}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right align-top">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-black text-slate-900 italic">
                      {(sale.itemsTotal ?? 0).toLocaleString()} <span className="text-[10px] text-slate-400 not-italic">ETB</span>
                    </span>
                    <div className="flex gap-1 mt-1">
                      {sale.payments?.map((p, idx) => (
                        <span 
                          key={`${sale.saleId}-pay-${idx}`} 
                          className="text-[8px] font-black text-slate-400 border border-slate-100 px-1.5 py-0.5 rounded bg-slate-50 uppercase"
                        >
                          {p.bankName || p.method}
                        </span>
                      ))}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center align-top">
                  <div className="flex justify-center">
                    {sale.status === "CONFIRMED" ? (
                      <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 shadow-sm">
                        <BadgeCheck size={12} />
                        <span className="text-[9px] font-black uppercase">Final</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100 shadow-sm">
                        <AlertCircle size={12} className="animate-pulse" />
                        <span className="text-[9px] font-black uppercase">Draft</span>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-center">
  {!isFullView ? (
    <Button 
      variant="outline"
      size="sm"
      className="text-[10px] font-black uppercase tracking-widest gap-2 hover:bg-white"
      onClick={() => router.push(`/sales?period=${period}&full=true`)}
    >
      View Full {periodLabels[period] || ""} History
      <ChevronRight size={14} />
    </Button>
  ) : (
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
      End of Activity Log
    </p>
  )}
</div>
    </Card>
  );
}