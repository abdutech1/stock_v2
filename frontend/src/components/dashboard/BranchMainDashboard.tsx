"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "@/api/axios";
import { 
  TrendingUp, ShoppingBag, AlertTriangle, ArrowUpRight, 
  DollarSign, Receipt, Package, ArrowRight
} from "lucide-react";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

// --- Types for Industry Standard Type-Safety ---
interface DashboardData {
  kpis: {
    today: { revenue: number; transactions: number };
    month: { netProfit: number; grossMargin: number };
  };
  inventory: { lowStock: number; outOfStock: number };
  charts: {
    revenueTrend: Array<{ date: string; revenue: number; grossProfit: number }>;
    topProducts: Array<{ name: string; quantity: number }>;
  };
  recentSales: Array<{ id: string; customer: string; amount: number; time: string }>;
}

export default function BranchMainDashboard() {
  const { data: dashboard, isLoading, isError } = useQuery<DashboardData>({
    queryKey: ["branch-dashboard"],
    queryFn: async () => {
      const res = await api.get("/branch-dashboard/current"); 
      return res.data.data.dashboard;
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  if (isLoading) return <DashboardSkeleton />;
  if (isError || !dashboard) return <ErrorState />;

  const { kpis, inventory, charts, recentSales } = dashboard;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-4 md:p-8 space-y-8 bg-[#f8fafc] dark:bg-black min-h-screen text-slate-900 dark:text-white"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">
            Branch <span className="text-indigo-600">Insights</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Real-time performance metrics</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">Live Updates Enabled</span>
        </div>
      </div>

      {/* 1. KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Daily Revenue" 
          value={`${kpis.today.revenue.toLocaleString()} ETB`} 
          sub={`${kpis.today.transactions} Transactions Today`}
          icon={<DollarSign size={20} />}
          trend="+12%"
          color="indigo"
        />
        <StatCard 
          title="Monthly Net" 
          value={`${kpis.month.netProfit.toLocaleString()} ETB`} 
          sub={`${kpis.month.grossMargin}% Margin`}
          icon={<TrendingUp size={20} />}
          trend="+5.4%"
          color="emerald"
        />
        <StatCard 
          title="Stock Alert" 
          value={inventory.lowStock} 
          sub="Items below threshold"
          icon={<Package size={20} />}
          alert={inventory.lowStock > 0}
          color="amber"
        />
        <StatCard 
          title="Critical Out" 
          value={inventory.outOfStock} 
          sub="Requiring immediate restock"
          icon={<AlertTriangle size={20} />}
          alert={inventory.outOfStock > 0}
          color="rose"
        />
      </div>

      {/* 2. Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart Column */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black uppercase italic tracking-tight">Revenue Analytics</h3>
              <select className="bg-slate-50 dark:bg-slate-800 border-none text-[10px] font-black uppercase rounded-lg px-3 py-1">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.revenueTrend}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} dy={10} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRev)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Sales Table-style List */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black uppercase italic tracking-tight">Recent Sales</h3>
              <button className="text-indigo-600 font-black text-[10px] uppercase flex items-center gap-1">
                View All <ArrowRight size={14}/>
              </button>
            </div>
            <div className="space-y-4">
              {recentSales?.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500">
                      <Receipt size={18}/>
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight">{sale.customer || "Walk-in Customer"}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{sale.time}</p>
                    </div>
                  </div>
                  <p className="text-md font-black italic">+{sale.amount} ETB</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sidebar Column */}
        <motion.div variants={itemVariants} className="space-y-8">
          {/* Top Products */}
          <div className="bg-slate-900 dark:bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 dark:shadow-none">
            <h3 className="text-xl font-black uppercase italic mb-8 flex items-center gap-2">
              <ShoppingBag size={20}/> Top Sellers
            </h3>
            <div className="space-y-6">
              {charts.topProducts.map((product, i) => (
                <div key={i} className="group cursor-default">
                  <div className="flex justify-between text-xs font-black uppercase mb-2">
                    <span className="opacity-80 group-hover:opacity-100 transition-opacity">{product.name}</span>
                    <span>{product.quantity}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(product.quantity / charts.topProducts[0].quantity) * 100}%` }}
                      className="h-full bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions / Integration Info */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black uppercase italic mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Avg Sale</p>
                <p className="font-black italic">450 ETB</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Peak Time</p>
                <p className="font-black italic">2:00 PM</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}

// --- Sub-components ---

function StatCard({ title, value, sub, icon, alert, trend, color }: any) {
  const colorMap: any = {
    indigo: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20",
    emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
    amber: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
    rose: "text-rose-600 bg-rose-50 dark:bg-rose-900/20",
  };

  return (
    <motion.div 
      variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }}
      whileHover={{ y: -5 }}
      className={`relative p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border transition-all duration-300 ${alert ? 'border-rose-500 shadow-lg shadow-rose-100 dark:shadow-none' : 'border-slate-100 dark:border-slate-800'}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl ${colorMap[color]}`}>{icon}</div>
        {trend && (
          <span className="text-[10px] font-black px-2 py-1 bg-emerald-100 text-emerald-600 rounded-lg">
            {trend}
          </span>
        )}
      </div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
      <h2 className="text-3xl font-black italic tracking-tighter mb-2">{value}</h2>
      <p className="text-slate-400 text-[10px] font-bold uppercase italic">{sub}</p>
    </motion.div>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-700 shadow-2xl">
        <p className="text-[10px] font-black uppercase mb-1">{payload[0].payload.date}</p>
        <p className="text-lg font-black italic">{payload[0].value.toLocaleString()} ETB</p>
      </div>
    );
  }
  return null;
}

function DashboardSkeleton() {
  return (
    <div className="p-8 space-y-8 animate-pulse">
      <Skeleton className="h-12 w-64 rounded-xl" />
      <div className="grid grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-40 rounded-[2.5rem]" />)}
      </div>
      <div className="grid grid-cols-3 gap-8">
        <Skeleton className="col-span-2 h-[400px] rounded-[2.5rem]" />
        <Skeleton className="h-[400px] rounded-[2.5rem]" />
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-6">
      <div className="p-6 bg-rose-50 rounded-full mb-4"><AlertTriangle className="text-rose-500" size={48}/></div>
      <h2 className="text-2xl font-black uppercase italic">Sync Interrupted</h2>
      <p className="text-slate-500 max-w-xs mt-2">We couldn't fetch your branch data. Please check your connection or try switching branches again.</p>
    </div>
  );
}