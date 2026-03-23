"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { PackageSearch, Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import api from "@/api/axios";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { RecentSalesTable } from "@/components/dashboard/RecentSalesTable"; 
import { ArrowLeft, History } from "lucide-react";

interface Category {
  id: number;
  name: string;
  imageUrl?: string;
  _count?: { pricecategory: number };
}

export default function SalesCategoryPage() {
  const NEXT_PUBLIC_API_URL = "http://localhost:5000";
  const [search, setSearch] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const period = searchParams.get("period");
  const isFull = searchParams.get("full");

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ["sales-history", period, isFull], 
    queryFn: async () => {
      const url = `/reports/dashboard?period=${period}${isFull === "true" ? "&full=true" : ""}`;
      const r = await api.get(url);
      return r.data.data;
    },
    enabled: !!period,
  });


  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["categories-active"],
    queryFn: () => api.get("/categories").then((r) => r.data),
  });

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  

  if (period) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => router.push('/dashboard')} 
              className="rounded-full bg-white"
            >
              <ArrowLeft size={18} />
            </Button>
            <h1 className="text-2xl font-black uppercase italic tracking-tighter">
              {period.replace('this', 'This ')} Sales Log
            </h1>
          </div>
          
          {historyLoading ? (
             <div className="h-64 bg-slate-200 animate-pulse rounded-2xl" />
          ) : (
            <RecentSalesTable 
              sales={historyData?.recentSales || []} 
              period={period} 
            />
          )}
          
          <Card className="bg-slate-900 text-white border-none shadow-xl">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black uppercase opacity-50">Total Period Revenue</p>
                <p className="text-2xl font-black italic">
                  {historyData?.sales?.totalRevenue?.toLocaleString()} ETB
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase opacity-50">Total Sales Count</p>
                <p className="text-2xl font-black italic">{historyData?.sales?.salesCount || 0}</p>
              </div>
              <History className="text-slate-700 hidden sm:block" size={40} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-950 to-slate-900 pb-20 pt-6 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex items-center justify-between">
            
            <h1 className="text-4xl font-black tracking-tighter text-white bg-clip-text">
                STORE<span className="text-cyan-500">POS</span>
              </h1>
            <Badge
              variant="outline"
              className="bg-slate-800/50 text-cyan-400 border-cyan-700/50">
              {categories.length} Categories
            </Badge>
          </div>

          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={20}
            />
            <Input
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 bg-slate-900/70 border-slate-700 h-12 text-white rounded-xl backdrop-blur-sm focus-visible:ring-cyan-500/50 focus-visible:ring-offset-slate-950"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-72 sm:h-80 bg-slate-800/50 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <PackageSearch size={80} className="mx-auto text-slate-700 mb-6" />
            <h2 className="text-2xl font-bold text-slate-300">
              No categories found
            </h2>
            <p className="text-slate-500 mt-3">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
            {filtered.map((category) => (
              <motion.div
                key={category.id}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                onClick={() => router.push(`/sales/${category.id}`)}
                className="group cursor-pointer active:scale-95 transition-transform">
                <Card className="overflow-hidden bg-linear-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-cyan-600/50 transition-all duration-300 shadow-lg rounded-2xl h-full flex flex-col">
                  {/* Image */}
                  <div className="relative flex-1 min-h-35 sm:min-h-45">
                    <img
                      src={
                        category.imageUrl
                          ? `${NEXT_PUBLIC_API_URL}${category.imageUrl}`
                          : "/placeholder-category.png"
                      }
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-active:scale-105 px-3 rounded-3xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder-category.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Badge */}
                    {category._count && category._count.pricecategory > 0 && (
                      <Badge className="absolute top-4 right-4 bg-cyan-600/90 hover:bg-cyan-600 text-white font-bold px-3 py-1">
                        {category._count.pricecategory} variants
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-5 flex flex-col items-center gap-4">
                    <h3 className="text-sm sm:text-xl md:text-2xl font-bold text-white text-center line-clamp-2">
                      {category.name}
                    </h3>

                    <Button className="w-full bg-linear-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-medium h-12 rounded-xl shadow-lg">
                      Select
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
