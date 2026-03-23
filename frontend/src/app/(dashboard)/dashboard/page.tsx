"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "@/api/axios";
import { useAuth } from "@/hooks/useAuth";
import AddStockModal from "@/components/stock/AddStockModal";
import {
  TrendingUp, Package, DollarSign, Users, AlertCircle, 
  Wallet, ShoppingBag, RefreshCcw, Target, BarChart3, Receipt
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,LabelList } from "recharts";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { RecentSalesTable } from "@/components/dashboard/RecentSalesTable";

const COLORS = ["#6366f1", "#ec4899", "#10b981", "#f59e0b"];

const periodLabels: Record<string, string> = {
  today: "Daily",
  thisWeek: "Weekly",
  thisMonth: "Monthly"
};

export default function DashboardPage() {
  const { user, role } = useAuth();
  const [period, setPeriod] = useState("today"); 
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const queryClient = useQueryClient();
  const isOwner = role === "OWNER";

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-summary", period],
    queryFn: async () => {
      const res = await api.get(`/reports/dashboard?period=${period}`);
      return res.data.data;
    },
  });


 

  if (isLoading) return <DashboardSkeleton />;

const profitMargin = isOwner && data?.financial && data?.sales?.totalRevenue > 0
  ? ((data.financial.netProfit / data.sales.totalRevenue) * 100).toFixed(1)
  : "0.0";

  const paymentData = Object.entries(data?.sales?.paymentBreakdown || {})
  .map(([name, value]) => ({
    name, 
    value: Number(value)
  }))
  .filter(item => item.value > 0);

  const isNegativeProfit = (data?.financial?.netProfit ?? 0) < 0;

  return (
    <div className="max-w-[1600px] mx-auto p-4 lg:p-8 space-y-8 bg-slate-50/30 min-h-screen">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">
            {isOwner ? "Dashboard" : `${periodLabels[period]} Hustle`}
          </h1>
         <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-1">
      {/* Dynamic Welcome text */}
      {periodLabels[period]} report for <span className="text-indigo-600">{user?.name}</span>
    </p>
        </motion.div>

        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm self-start md:self-auto">
          {['today', 'thisWeek', 'thisMonth'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-6 py-2 text-[10px] font-black uppercase transition-all rounded-lg ${
                period === p ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {p.replace('this', '')}
            </button>
          ))}
        </div>
          
      </div>
    

      
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
  {/* REVENUE - The Top Line */}
  <StatCard 
    title={isOwner ? "Total Revenue" : "My Personal Revenue"} 
    value={`${(data?.sales?.totalRevenue ?? 0).toLocaleString()}`}
    unit="ETB"
    icon={<DollarSign size={18} className="text-emerald-500" />}
    subtitle={isOwner ? "Total Money Collected" : `${data?.sales?.salesCount ?? 0} Sales Logged`}
    color="emerald"
  />

  {isOwner ? (
    <>
      {/* NET PROFIT - The Bottom Line (REVENUE - COGS - EXPENSES - PAYROLL) */}
  
<StatCard 
  title="Net Profit" 
  value={`${(data?.financial?.netProfit ?? 0).toLocaleString()}`}
  unit="ETB"
  icon={<TrendingUp size={18} className={isNegativeProfit ? "text-red-500" : "text-emerald-500"} />}
  variant={isNegativeProfit ? "danger" : "success"} 
  subtitle={isNegativeProfit 
    ? "Loss detected after high expenses/payroll" 
    : `${profitMargin}% Margin after Stock & Expenses`
  }
/>
      
      
<StatCard 
  title={
    period === 'today' ? "Today's Payouts" : 
    period === 'thisWeek' ? "Weekly Payroll" : 
    "Monthly Payroll"
  }
  value={`${(data?.financial?.totalPayroll ?? 0).toLocaleString()}`}
  unit="ETB"
  icon={<Users size={18} className="text-purple-500" />}
  subtitle={
    data?.financial?.totalPayroll > 0 
      ? `Confirmed payments for ${data?.stats?.totalTeamMembers ?? 0} staff`
      : `No payroll transactions for this ${period.replace('this', '').toLowerCase()}`
  }
/>
    </>
  ) : (
    <StatCard 
    title={`${periodLabels[period]} Standing`} 
   value={data?.stats?.rank ? `Rank #${data.stats.rank}` : "Rank #--"}
    icon={<Target size={18} className="text-indigo-500" />}
    subtitle={`Against ${data?.stats?.totalTeamMembers ?? 0} Active Staff`}
  />
  )}

  {/* INVENTORY - Operational Health */}
  <StatCard 
    title="Stock Health" 
    value={`${data?.inventory?.lowStockItems ?? 0}`}
    unit="LOW"
    icon={<Package size={18} className="text-blue-500" />}
    subtitle={`${data?.inventory?.outOfStockItems ?? 0} Sold Out Items`}
  />
</div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Data Visuals & Recent Sales */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <BarChart3 size={16} /> Revenue by Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[280px] mt-6">
              {paymentData.length > 0 ? (
                
                <ResponsiveContainer width="100%" height="100%">
  <BarChart 
    data={paymentData} 
    margin={{ top: 10, right: 10, left: 20, bottom: 0 }} 
  >
    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
    <XAxis 
      dataKey="name" 
      axisLine={false} 
      tickLine={false} 
      className="text-[10px] font-black uppercase fill-slate-400" 
      dy={10} 
    />
   
    
<YAxis 
  axisLine={false} 
  tickLine={false} 
  className="text-[10px] font-bold fill-slate-300"
  tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
  width={40}
  // Remove domain={[0, 200000]} to allow auto-scaling
/>
    <Tooltip cursor={{fill: '#f8fafc'}} content={<CustomTooltip />} />
    
    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={45}>
  <LabelList 
  dataKey="value" 
  position="top" 
  formatter={(val: any) => (val > 0 ? val.toLocaleString() : "")} 
  className="fill-slate-900 font-black text-[9px]" 
/>
  {paymentData.map((_, index) => (
    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
  ))}
</Bar>
  </BarChart>
</ResponsiveContainer>
              ) : (
                <EmptyState message="No transactions recorded for this period." />
              )}
            </CardContent>
          </Card>

         


{!isOwner && (
  <div className="mt-6">
    <RecentSalesTable 
      sales={data?.recentSales || []} 
      period={period} 
    />
  </div>
)}
        </div>

        {/* Right Column: Alerts & Actions */}
        <div className="space-y-6">
          <Card className="border-red-100 bg-red-50/30 border shadow-sm">
            <CardHeader className="pb-4 border-b border-red-100/50">
              <CardTitle className="text-[11px] font-black text-red-600 flex items-center gap-2 uppercase italic tracking-widest">
                <AlertCircle size={16} /> Inventory Risks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-600 font-black uppercase">Low Items</span>
                <span className="bg-white border border-red-200 text-red-600 px-3 py-1 rounded-lg font-black text-xs shadow-sm">
                  {data?.inventory?.lowStockItems ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-600 font-black uppercase">Sold Out</span>
                <span className="bg-red-600 text-white px-3 py-1 rounded-lg font-black text-xs shadow-md">
                  {data?.inventory?.outOfStockItems ?? 0}
                </span>
              </div>
              {isOwner && (
                <Button 
                  onClick={() => setIsRestockOpen(true)}
                  className="w-full h-10 bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest shadow-lg transition-transform active:scale-95"
                >
                  Manage Inventory
                </Button>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-3">
             <NavButton label="New Sale" icon={<ShoppingBag size={18} />} href="/sales" color="indigo" primary />
             {isOwner && <NavButton label="View Stocks" icon={<Package size={18} />} href="/stocks" color="slate" />}
             {isOwner && <NavButton label="Audit Logs" icon={<RefreshCcw size={18} />} href="/reconciliation" color="slate" />}
          </div>
        </div>
      </div>

      <AddStockModal 
        open={isRestockOpen} 
        onClose={() => setIsRestockOpen(false)} 
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] })} 
      />
    </div>
  );
}


function StatCard({ title, value, unit, icon, subtitle, variant }: any) {
  return (
    <Card className={cn(
      "border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white relative overflow-hidden",
      variant === "danger" && "bg-red-50/50 border-red-100 shadow-red-100/20",
      variant === "success" && "bg-emerald-50/30 border-emerald-100"
    )}>
      {/* Accent Bar */}
      <div className={cn(
        "absolute top-0 left-0 w-1.5 h-full transition-colors",
        variant === "danger" ? "bg-red-500" : 
        variant === "success" ? "bg-emerald-500" : "bg-slate-100"
      )} />
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <p className={cn(
            "text-[10px] font-black uppercase tracking-widest",
            variant === "danger" ? "text-red-600" : "text-slate-400"
          )}>{title}</p>
          <div className={cn(
            "p-2 rounded-lg",
            variant === "danger" ? "bg-white border border-red-100" : "bg-slate-50"
          )}>{icon}</div>
        </div>
        
        <div className="flex items-baseline gap-1">
          <h3 className={cn(
            "text-3xl font-black",
            variant === "danger" ? "text-red-700" : "text-slate-900"
          )}>{value}</h3>
          {unit && (
            <span className={cn(
              "text-[10px] font-black uppercase",
              variant === "danger" ? "text-red-500" : "text-slate-400"
            )}>{unit}</span>
          )}
        </div>
        
        <p className={cn(
          "text-[11px] font-bold mt-1 italic",
          variant === "danger" ? "text-red-600/80" : "text-slate-500"
        )}>{subtitle}</p>
      </CardContent>
    </Card>
  );
}


function NavButton({ label, icon, href, primary }: any) {
  return (
    <Button 
      variant="outline" 
      asChild 
      className={cn(
        "h-14 justify-start gap-4 px-4 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all group",
        primary && "bg-indigo-600 border-none hover:bg-indigo-700 text-white"
      )}
    >
      <Link href={href}>
        <div className={cn("p-2 rounded-lg", primary ? "bg-indigo-500" : "bg-slate-100 group-hover:bg-white")}>
          {icon}
        </div>
        <span className="text-[11px] font-black uppercase tracking-[0.1em]">{label}</span>
      </Link>
    </Button>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-900 p-3 rounded-xl shadow-2xl border border-slate-800">
        <p className="text-[9px] font-black text-slate-500 uppercase mb-1">{payload[0].payload.name}</p>
        <p className="text-sm font-black text-white">{payload[0].value.toLocaleString()} <span className="text-[10px]">ETB</span></p>
      </div>
    );
  }
  return null;
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-slate-300">
      <BarChart3 size={32} className="mb-2 opacity-20" />
      <p className="text-[10px] font-black uppercase tracking-widest">{message}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="max-w-[1600px] mx-auto p-8 space-y-8 animate-pulse">
      <div className="h-10 w-64 bg-slate-200 rounded-lg" />
      <div className="grid grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl" />)}
      </div>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 h-[500px] bg-slate-200 rounded-xl" />
        <div className="h-[500px] bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}
