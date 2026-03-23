"use client";

import CountUp from "react-countup";
import { motion } from "framer-motion";
import {
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Boxes,
} from "lucide-react";

interface StockSummaryProps {
  totalQuantity?: number;
  purchaseValue?: number;
  fixedValue?: number;
  lowStockCount?: number;
  potentialProfit?: number;
  lowStockVariants?: number;
  lowStockProducts?: number;
  totalSkus?: number;
}

export default function StockSummaryCards({
  totalQuantity = 0,
  purchaseValue = 0,
  fixedValue = 0,
  potentialProfit = 0,
  lowStockVariants = 0,
  lowStockCount = 0,
  lowStockProducts = 0,
  totalSkus = 0,
}: StockSummaryProps) {
  const profitPercent =
    purchaseValue > 0
      ? ((potentialProfit / purchaseValue) * 100).toFixed(0)
      : "0";

  const isDanger = lowStockVariants >= 5;
  const isVeryGoodProfit = Number(profitPercent) >= 30;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      {/* 1. Total Units - Very Big & Important */}
      <motion.div
        className="relative overflow-hidden bg-linear-to-br from-cyan-600 via-cyan-700 to-blue-800 rounded-2xl p-6 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.03 }}>
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl" />

        <div className="flex items-center justify-between mb-2">
          <Package size={32} className="text-cyan-200" />
          <span className="text-cyan-200/80 text-sm font-medium tracking-wider uppercase">
            TOTAL UNITS
          </span>
        </div>

        <div className="text-5xl  font-black text-white tracking-tight">
          <CountUp end={totalQuantity} duration={2.2} separator="," />
        </div>
      </motion.div>

      {/* 2. Capital Invested */}
      <motion.div
        className="bg-linear-to-br from-indigo-700 via-indigo-800 to-purple-900 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.03 }}>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl" />

        <div className="flex items-center justify-between mb-2">
          <DollarSign size={32} className="text-indigo-200" />
          <span className="text-indigo-200/80 text-sm font-medium tracking-wider uppercase">
            CAPITAL
          </span>
        </div>

        <div className="text-4xl  font-black text-white">
          <CountUp
            end={purchaseValue}
            duration={2.4}
            separator=","
            decimals={0}
          />
          <span className="text-2xl font-bold"> ETB</span>
        </div>
      </motion.div>

      {/* 3. Potential Revenue */}
      <motion.div
        className="bg-linear-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.03 }}>
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl" />

        <div className="flex items-center justify-between mb-2">
          <DollarSign size={32} className="text-emerald-200" />
          <span className="text-emerald-200/80 text-sm font-medium tracking-wider uppercase">
            POTENTIAL
          </span>
        </div>

        <div className="text-4xl  font-black text-white">
          <CountUp end={fixedValue} duration={2.4} separator="," decimals={0} />
          <span className="text-2xl font-bold"> ETB</span>
        </div>
      </motion.div>

      {/* 4. Profit - Most Dramatic */}
      <motion.div
        className={`relative overflow-hidden rounded-2xl p-6 shadow-2xl transition-all duration-500 ${
          isVeryGoodProfit
            ? "bg-linear-to-br from-lime-600 via-lime-700 to-emerald-800"
            : "bg-linear-to-br from-amber-600 to-orange-800"
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.04 }}>
        <div className="absolute inset-0 bg-white/5" />

        <div className="flex items-center justify-between mb-2">
          <TrendingUp size={32} className="text-white" />
          <span className="text-white/80 text-sm font-medium tracking-wider uppercase">
            PROFIT
          </span>
        </div>

        <div className="text-4xl  font-black text-white tracking-tight mb-1">
          <CountUp
            end={potentialProfit}
            duration={2.6}
            separator=","
            decimals={0}
          />
          <span className="text-3xl font-bold"> ETB</span>
        </div>

        <div className="text-3xl lg:text-4xl font-bold text-white/90">
          +{profitPercent}%
        </div>
      </motion.div>

      {/* 5. Low Stock Alert - Very Strong when dangerous */}
      {/* <motion.div
        className={`rounded-2xl p-6 shadow-2xl relative overflow-hidden transition-all duration-500 ${
          isDanger
            ? "bg-linear-to-br from-red-600 via-rose-700 to-red-800 animate-pulse-slow"
            : "bg-linear-to-br from-slate-700 to-slate-800"
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.03 }}>
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-red-400/10 rounded-full blur-3xl" />

        <div className="flex items-center justify-between mb-2">
          <AlertTriangle size={32} className="text-white" />
          <span className="text-white/80 text-sm font-medium tracking-wider uppercase">
            LOW STOCK
          </span>
        </div>

        <div className="text-5xl font-black text-white">
          <CountUp end={lowStockVariants} duration={1.8} />
        </div>

        <div className="mt-1 text-lg text-white/90">
          {lowStockProducts > 0 && (
            <>
              across {lowStockProducts}{" "}
              {lowStockProducts === 1 ? "product" : "products"}
            </>
          )}
        </div>

        <div className="mt-2 text-xl font-medium text-white/90">
          {isDanger
            ? "URGENT ACTION NEEDED"
            : lowStockVariants === 0
              ? "All good"
              : "Monitor closely"}
        </div>
      </motion.div> */}
      {/* 6. Total SKUs - New Card */}
      <motion.div
        className="relative overflow-hidden bg-linear-to-br from-violet-600 via-violet-700 to-fuchsia-800 rounded-2xl p-6 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }} // Appears first
        whileHover={{ scale: 1.03 }}>
        <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-violet-400/20 rounded-full blur-3xl" />

        <div className="flex items-center justify-between mb-2">
          <Boxes size={32} className="text-violet-200" />
          <span className="text-violet-200/80 text-sm font-medium tracking-wider uppercase">
            Product Variants
          </span>
        </div>

        <div className="text-5xl font-black text-white tracking-tight">
          <CountUp end={totalSkus} duration={2} />
        </div>

        <div className="mt-2 text-sm font-medium text-violet-100/70">
          Unique Variants
        </div>
      </motion.div>
    </div>
  );
}
