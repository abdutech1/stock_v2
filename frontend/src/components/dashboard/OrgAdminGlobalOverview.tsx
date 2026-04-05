"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Users, ShoppingBag, TrendingUp, Loader2 } from "lucide-react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import Navbar from "../CommonNav";
import { useApp } from "@/context/AppContext";


const translations: any = {
  en: {
    revenue: "Revenue",
    staff: "Total Staff",
    products: "Products",
    branches: "Active Branches",
    title: "Select",
    subtitle: "Branch",
    manage: "Manage Branch",
    connecting: "Connecting...",
    currency: "ETB"
  },
  am: {
    revenue: "ጠቅላላ ገቢ",
    staff: "ጠቅላላ ሰራተኞች",
    products: "ምርቶች",
    branches: "ንቁ ቅርንጫፎች",
    title: "ቅርንጫፍ",
    subtitle: "ይምረጡ",
    manage: "ቅርንጫፉን ያስተዳድሩ",
    connecting: "በመገናኘት ላይ...",
    currency: "ብር"
  }
};


export default function OrgAdminGlobalOverview({ branches }: { branches: any[] }) {
  const { language, setActiveBranchId } = useApp();
  const t = translations[language as string] || translations.en;

  const { data: stats } = useQuery({
    queryKey: ["global-stats"],
    queryFn: async () => {
      const res = await api.get("/reports/global-overview");
      return res.data.data;
    },
  });

const switchBranch = useMutation({
    mutationFn: async (branchId: number) => {
      // 1. Save to local state/context immediately
      setActiveBranchId(branchId); 
      
      // 2. Call your API to update session/cookie
      const res = await api.post("/auth/switch-branch", { branchId });
      return res.data.data;
    },
    onSuccess: () => {
      window.location.href = "/dashboard/main";
    }
  });

  return (
    <div className="dark:bg-slate-950 min-h-screen transition-colors duration-500">
      <Navbar />
      
      <div className="max-w-[1400px] mx-auto p-6 space-y-10">
        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <QuickStat label={t.revenue} value={`${stats?.totalRevenue || 0} ${t.currency}`} icon={<TrendingUp size={16}/>} color="text-emerald-500" />
          <QuickStat label={t.staff} value={stats?.totalEmployees || 0} icon={<Users size={16}/>} />
          <QuickStat label={t.products} value={stats?.totalProducts || 0} icon={<ShoppingBag size={16}/>} />
          <QuickStat label={t.branches} value={branches?.length || 0} icon={<Building2 size={16}/>} />
        </motion.div>

        <div className="space-y-6">
          <h2 className="text-3xl font-black uppercase italic dark:text-white tracking-tighter">
            {language === 'en' ? (
              <>{t.title} <span className="text-indigo-600">{t.subtitle}</span></>
            ) : (
              <><span className="text-indigo-600">{t.title}</span> {t.subtitle}</>
            )}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {branches?.map((branch, index) => {
                // Check if THIS specific branch is being processed
                const isThisBranchLoading = switchBranch.isPending && switchBranch.variables === branch.id;
                const isAnyLoading = switchBranch.isPending;

                return (
                  <motion.div 
                    key={branch.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={!isAnyLoading ? { y: -8, transition: { duration: 0.2 } } : {}}
                    className={`bg-white dark:bg-slate-900 border p-6 rounded-[2.5rem] shadow-xl transition-all duration-300
                      ${isThisBranchLoading ? 'ring-4 ring-indigo-500/20 border-indigo-500' : 'border-slate-100 dark:border-slate-800'}
                    `}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-4 rounded-2xl transition-colors duration-300 ${isThisBranchLoading ? 'bg-indigo-600 text-white' : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600'}`}>
                        <Building2 size={28} />
                      </div>
                    </div>

                    <h3 className="text-2xl mb-8 font-black dark:text-white uppercase truncate tracking-tight">
                      {branch.name}
                    </h3>

                    <motion.div whileTap={{ scale: 0.96 }}>
                      <Button 
                        onClick={() => switchBranch.mutate(branch.id)}
                        disabled={isAnyLoading}
                        className={`
                          w-full h-14 rounded-2xl font-black uppercase text-xs tracking-widest transition-all duration-300 cursor-pointer
                          ${isThisBranchLoading 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-500'
                          }
                          disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                      >
                        {isThisBranchLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="animate-spin" size={18} />
                            {t.connecting}
                          </div>
                        ) : (
                          t.manage
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}


function QuickStat({ label, value, icon, color = "text-slate-900 dark:text-white" }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-1 text-slate-400">
        {icon} <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className={`text-lg font-black uppercase italic ${color}`}>{value}</p>
    </div>
  );
}