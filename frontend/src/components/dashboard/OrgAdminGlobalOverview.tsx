"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Building2, Users, ShoppingBag, TrendingUp } from "lucide-react";
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
  const { language } = useApp();
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
      const res = await api.post("/auth/switch-branch", { branchId });
      return res.data.data;
    },
    onSuccess: () => {
      window.location.href = "/dashboard/main";
    }
  });

  return (
    <div className="dark:bg-slate-950 min-h-screen">
      <Navbar />
      
      <div className="max-w-[1400px] mx-auto p-6 space-y-10">
        {/* Mini Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickStat label={t.revenue} value={`${stats?.totalRevenue || 0} ${t.currency}`} icon={<TrendingUp size={16}/>} color="text-emerald-500" />
          <QuickStat label={t.staff} value={stats?.totalEmployees || 0} icon={<Users size={16}/>} />
          <QuickStat label={t.products} value={stats?.totalProducts || 0} icon={<ShoppingBag size={16}/>} />
          <QuickStat label={t.branches} value={branches?.length || 0} icon={<Building2 size={16}/>} />
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-black uppercase italic dark:text-white tracking-tighter">
            {language === 'en' ? (
              <>{t.title} <span className="text-indigo-600">{t.subtitle}</span></>
            ) : (
              <><span className="text-indigo-600">{t.title}</span> {t.subtitle}</>
            )}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches?.map((branch) => (
              <motion.div 
                key={branch.id}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[2rem] shadow-xl"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600">
                    <Building2 />
                  </div>
                </div>

                <h3 className="text-xl mb-6 font-black dark:text-white uppercase truncate">{branch.name}</h3>
                {/* <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6 italic">
                  Role: {branch.userBranchRole}
                </p> */}

                <Button 
                  onClick={() => switchBranch.mutate(branch.id)}
                  disabled={switchBranch.isPending}
                  className="w-full h-12 text-white rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 font-black uppercase text-xs tracking-widest"
                >
                  {switchBranch.isPending ? t.connecting : t.manage}
                </Button>
              </motion.div>
            ))}
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
