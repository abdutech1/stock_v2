"use client";

import Image from "next/image";

import { useState,useEffect } from "react";
import React from "react";
import Link from "next/link";
import { motion,AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Globe,
  ShieldCheck,
  Layers,
  Users,
  Truck,
  BarChart3,
  Award,
  Sun,
  Moon,
  CheckCircle2,
  XCircle,
  Activity,
} from "lucide-react";

import { useApp } from "@/context/AppContext";

type Language = "en" | "am";
type BillingCycle = "monthly" | "yearly";

const TELEGRAM_USERNAME = "abdulkadirakmel";

interface Translation {
  signIn: string;
  hero: {
    tag: string;
    welcome: string;
    description: string;
    ctaPrimary: string;
    telegramLink: string;
  };
  features: {
    list: Array<{ icon: React.ReactNode; title: string; description: string }>;
  };
  pricing: {
    title: string;
    contactSalesLink: string;
    plans: Array<{
      name: string;
      target: string;
      price: string | { monthly: string; yearly: string };
      features: string[];
      cta: string;
      popular?: boolean;
      telegramLink: string;
    }>;
  };
  faq: {
    title: string;
    questions: Array<{ q: string; a: string }>;
  };
  contact: {
    title: string;
    subtitle: string;
    nameLabel: string;
    emailLabel: string;
    messageLabel: string;
    sendBtn: string;
    successMsg: string;
  };
  success: {
    title: string;
    message: string;
    subMessage: string;
    closeBtn: string;
  };
}

export default function Home() {
  
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [showSuccess, setShowSuccess] = useState(false);

  const { language, theme, toggleTheme, toggleLanguage } = useApp();

  const t = translations[language];



  const getPrice = (price: any) => {
    if (typeof price === "string") return price;
    return billingCycle === "yearly" ? price.yearly : price.monthly;
  };

  const handleAction = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setShowSuccess(true);
  };

  return (
    
    <div className="min-h-screen transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
     <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1] bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:40px_40px]" />
  </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden shadow-xl shadow-indigo-500/30">
              <Image
                src="/vortex-logo.png"
                alt="Vortex"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-2xl hidden sm:block font-black tracking-tighter">
              VORTEX
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              {theme === "light" ? <Moon size={22} /> : <Sun size={22} />}
            </button>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold hover:text-indigo-600">
              {/* <Globe className="hidden sm:block" size={20} /> */}
              <span>{language === "en" ? "AM" : "EN"}</span>
            </button>
            <Link
              href="/login"
              className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold hover:bg-indigo-600 hover:text-white transition-all">
              {t.signIn}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-28 pb-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-100 dark:bg-indigo-950 rounded-full mb-6">
            <Sparkles size={18} className="text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-widest">
              {t.hero.tag}
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-none mb-8">
            {t.hero.welcome}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12">
            {t.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={t.hero.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group px-10 py-5 bg-indigo-600 text-white text-lg font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/30">
              {t.hero.ctaPrimary}{" "}
              <ArrowRight className="group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="#pricing"
              className="px-10 py-5 border-2 border-slate-300 dark:border-slate-700 hover:border-indigo-600 rounded-2xl font-bold text-lg transition-all">
              See Plans
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Overview */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          {t.features.list.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="p-10 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="mb-8 text-indigo-600">{f.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Cards */}
      <section
        id="pricing"
        className="py-24 px-6 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black tracking-tighter mb-4">
              {t.pricing.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Pick the plan that fits your business today
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-white dark:bg-slate-900 p-1 rounded-full border border-slate-200 dark:border-slate-800 shadow">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-8 py-3 rounded-full text-sm font-semibold transition-all ${billingCycle === "monthly" ? "bg-indigo-600 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-8 py-3 rounded-full text-sm font-semibold flex items-center gap-2 transition-all ${billingCycle === "yearly" ? "bg-indigo-600 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                Yearly{" "}
                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                  Save 17%
                </span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.pricing.plans.map((plan) => (
              <motion.div
                key={plan.name}
                whileHover={{ scale: plan.popular ? 1.04 : 1.02 }}
                className={`relative rounded-3xl p-8 flex flex-col border-2 bg-white dark:bg-slate-900 transition-all ${plan.popular ? "border-indigo-600 shadow-2xl shadow-indigo-500/25 scale-[1.03]" : "border-slate-200 dark:border-slate-800 hover:border-indigo-400"}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-6 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}

                <p className="uppercase text-xs tracking-widest font-bold text-slate-500 mb-1">
                  {plan.name}
                </p>
                <div className="text-4xl font-black tracking-tighter mb-1">
                  {getPrice(plan.price)}
                </div>
                <p className="text-xs text-slate-500 mb-8">
                  {billingCycle === "yearly"
                    ? "Billed annually"
                    : "Billed monthly"}
                </p>

                <p className="text-indigo-600 font-semibold mb-8 text-sm">
                  {plan.target}
                </p>

                <ul className="space-y-4 mb-12 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <CheckCircle2
                        size={19}
                        className="text-indigo-600 mt-0.5"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                {/* <Link
                  href={plan.telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-4 text-center rounded-2xl font-bold text-sm uppercase tracking-widest transition-all ${
                    plan.popular
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30"
                      : "bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-slate-900"
                  }`}>
                  {plan.cta}
                </Link> */}
                <button
  onClick={() => {
    window.open(plan.telegramLink, "_blank");
    setShowSuccess(true);
  }}
  className={`w-full py-4 text-center rounded-2xl font-bold text-sm uppercase tracking-widest transition-all ${
    plan.popular
      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
      : "bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-slate-900"
  }`}
>
  {plan.cta}
</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center tracking-tighter mb-12">
            Compare All Plans
          </h2>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <th className="p-6 text-left font-semibold">Features</th>
                  <th className="p-6 text-center font-semibold">FREE</th>
                  <th className="p-6 text-center font-semibold bg-indigo-50 dark:bg-indigo-950/50">
                    BASIC
                  </th>
                  <th className="p-6 text-center font-semibold">PRO</th>
                  <th className="p-6 text-center font-semibold bg-indigo-600 text-white rounded-tr-3xl">
                    ENTERPRISE
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {comparisonFeatures.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors">
                    <td className="p-6 font-medium">{row.feature}</td>
                    {row.values.map((val, i) => (
                      <td key={i} className="p-6 text-center">
                        {val === true ? (
                          <CheckCircle2
                            className="mx-auto text-green-500"
                            size={22}
                          />
                        ) : val === false ? (
                          <XCircle
                            className="mx-auto text-slate-300"
                            size={22}
                          />
                        ) : (
                          <span className="text-slate-600 dark:text-slate-400">
                            {val}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-center tracking-tighter mb-16">
            {t.faq.title}
          </h2>
          <div className="space-y-6">
            {t.faq.questions.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold mb-3 flex items-start gap-3">
                  <span className="text-indigo-600 font-black">Q.</span>
                  {item.q}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed pl-7">
                  {item.a}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Secondary CTA under FAQ */}
          <div className="mt-16 text-center">
            <p className="text-slate-500 mb-6">Still have questions?</p>
            <Link
              href={t.hero.telegramLink}
              className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:gap-4 transition-all">
              Ask us on Telegram <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
      {/* Contact Form Section */}
      <section className="py-24 px-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black tracking-tighter mb-6">
              {t.contact.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
              {t.contact.subtitle}
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-indigo-600 font-bold">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center">
                  <Globe size={24} />
                </div>
                <span>Addis Ababa, Ethiopia</span>
              </div>
            </div>
          </div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl"
            onSubmit={(e) => {
              e.preventDefault();
              handleAction();
            }}>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                  {t.contact.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                  {t.contact.emailLabel}
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                  {t.contact.messageLabel}
                </label>
                <textarea
                  rows={4}
                  required
                  className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2">
                {t.contact.sendBtn}
                <ArrowRight size={20} />
              </button>
            </div>
          </motion.form>
        </div>
      </section>
      {/* Footer */}
      <footer className="py-16 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
        Vortex © {new Date().getFullYear()} • Built for Ethiopian businesses
        that scale globally
      </footer>
      {/* Floating Telegram Support Bubble */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          className="relative group">
          {/* Tooltip */}
          <div className="absolute right-20 top-1/2 -translate-y-1/2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none">
            {language === "en"
              ? "Need help? Chat with Abdu"
              : "እገዛ ይፈልጋሉ? አሁኑኑ ያግኙን"}
          </div>

          <Link
            href={t.hero.telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-full shadow-[0_20px_50px_rgba(79,70,229,0.4)] hover:bg-indigo-700 transition-all">
            {/* Pulse Animation */}
            <span className="absolute inset-0 rounded-full bg-indigo-600 animate-ping opacity-20"></span>

            {/* Telegram-style Message Icon */}
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </Link>
        </motion.div>
      </div>
      {/* Success Overlay */}
<AnimatePresence>
  {showSuccess && (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[3rem] p-12 text-center shadow-2xl border border-slate-200 dark:border-slate-800"
      >
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        
        <h2 className="text-3xl font-black tracking-tighter mb-4">
          {t.success.title}
        </h2>
        <p className="font-bold text-indigo-600 mb-2">
          {t.success.message}
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 leading-relaxed">
          {t.success.subMessage}
        </p>

        <button 
          onClick={() => setShowSuccess(false)}
          className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-xl"
        >
          {t.success.closeBtn}
        </button>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
}

// Comparison Data
const comparisonFeatures = [
  { feature: "Branches", values: ["1 (30 days)", "1", "Up to 5", "Unlimited"] },
  { feature: "Staff / Users", values: ["3", "5", "20", "Unlimited"] },
  {
    feature: "Products & Variants",
    values: ["Unlimited", "Unlimited", "Unlimited", "Unlimited"],
  },
  { feature: "Stock Transfers", values: [false, false, true, true] },
  {
    feature: "Multi-Price Types (Retail, Wholesale, Promotion)",
    values: [false, true, true, true],
  },
  { feature: "Customer Credit Management", values: [false, true, true, true] },
  { feature: "Expense & Bonus Rules", values: [false, false, true, true] },
  {
    feature: "Advanced HR (Attendance, Salary, Bonus)",
    values: [false, false, true, true],
  },
  { feature: "Audit Logs & Full History", values: [false, false, true, true] },
  { feature: "API Access", values: [false, false, false, true] },
  { feature: "Priority Support", values: [false, false, false, true] },
  { feature: "Custom Feature Flags", values: [false, false, false, true] },
];

const translations: Record<Language, Translation> = {
  en: {
    signIn: "Sign In",
    hero: {
      tag: "Industry-Standard Stock Management",
      welcome: "Run Your Business\nWith Confidence",
      description:
        "Complete inventory, sales, multi-branch & team management system built for Ethiopian shops and enterprises.",
      ctaPrimary: "Start Free Trial",
      telegramLink: `https://t.me/${TELEGRAM_USERNAME}?text=Hello! I'm interested in the Free Trial.`,
    },
    features: {
      list: [
        {
          icon: <Layers size={42} />,
          title: "Multi-Branch Ready",
          description:
            "Real-time stock transfers and centralized control across all locations.",
        },
        {
          icon: <Users size={42} />,
          title: "Smart Team Management",
          description:
            "Role-based access, attendance, salary & performance bonuses.",
        },
        {
          icon: <Truck size={42} />,
          title: "Powerful Inventory",
          description:
            "Stock alerts, purchases, returns, damage tracking & multiple price levels.",
        },
      ],
    },
    pricing: {
      title: "Choose Your Plan",
      contactSalesLink: `https://t.me/${TELEGRAM_USERNAME}?text=Hello! I'd like to discuss the Enterprise plan for my company.`,
      plans: [
        {
          name: "FREE",
          target: "Testing & Micro Shops",
          price: "ETB 0 ($0)",
          features: [
            "30 days only",
            "1 Branch",
            "3 Staff",
            "Basic Sales & Stock",
          ],
          cta: "Start Free",
          telegramLink: `https://t.me/${TELEGRAM_USERNAME}?text=Hello! I'd like to start with the FREE trial plan.`,
        },
        {
          name: "BASIC",
          target: "Single Shop",
          price: { monthly: "ETB 1,100 ($9)", yearly: "ETB 900 ($7.5)" },
          features: [
            "1 Branch",
            "5 Staff",
            "Unlimited Products",
            "Sales, Purchases & Customers",
            "Attendance",
          ],
          cta: "Choose Basic",
          telegramLink: `https://t.me/${TELEGRAM_USERNAME}?text=Hello! I'm interested in the BASIC plan.`,
        },
        {
          name: "PRO",
          target: "Growing Business",
          price: { monthly: "ETB 4,200 ($27)", yearly: "ETB 3,500 ($22)" },
          popular: true,
          features: [
            "Up to 5 Branches",
            "20 Staff",
            "Stock Transfers",
            "Advanced Pricing",
            "Expenses & Bonuses",
            "Audit Logs",
          ],
          cta: "Choose Pro",
          telegramLink: `https://t.me/${TELEGRAM_USERNAME}?text=Hello! I want to get started with the PRO plan.`,
        },
        {
          name: "ENTERPRISE",
          target: "Large Chains & Distributors",
          price: "ETB 9,000 ($57)",
          features: [
            "Unlimited Branches & Staff",
            "Advanced HR & Payroll",
            "API Access",
            "Priority Support",
            "Custom Features",
          ],
          cta: "Contact Sales",
          telegramLink: `https://t.me/${TELEGRAM_USERNAME}?text=Hello! I need more information about the ENTERPRISE plan.`,
        },
      ],
    },
    faq: {
      title: "Frequently Asked Questions",
      questions: [
        {
          q: "How do I pay for a subscription?",
          a: "We support local bank transfers (CBE, Telebirr ...) and international card payments for diaspora-owned businesses.",
        },
        {
          q: "Is my data safe and private?",
          a: "Yes. We use industry-standard encryption and daily backups. Your stock and sales data are visible only to you and your authorized staff.",
        },
        {
          q: "Can I use Vortex offline?",
          a: "Vortex requires an internet connection for real-time multi-branch syncing, but our interface is optimized to work even on slow 2G/3G connections.",
        },
        {
          q: "Do you provide training for my staff?",
          a: "Absolutely. Every setup includes a free 1-hour remote training session for your managers and cashiers.",
        },
      ],
    },
    contact: {
      title: "Get in Touch",
      subtitle:
        "Prefer email? Send us a message and our team will get back to you within 24 hours.",
      nameLabel: "Your Name",
      emailLabel: "Email",
      messageLabel: "How can we help?",
      sendBtn: "Send Message",
      successMsg: "Message sent! We'll be in touch soon.",
    },
    success: {
      title: "Request Received!",
      message: "Thank you for choosing Vortex.",
      subMessage:
        "Our team has been notified. If you clicked a plan, please check your Telegram to start the conversation.",
      closeBtn: "Back to Home",
    },
  },
  am: {
    signIn: "ግባ",
    hero: {
      tag: "ዘመናዊ የክምችት አስተዳደር",
      welcome: "ንግድዎን በተሟላ መንገድ ይቆጣጠሩ",
      description:
        "የቅርንጫፍ፣ ሽያጭ፣ ክምችት እና ሰራተኞች አስተዳደር ስርዓት። ለኢትዮጵያ ሱቆች እና ለሚያድጉ ድርጅቶች ተስማሚ።",
      ctaPrimary: "በነጻ ይጀምሩ",
      telegramLink: `https://t.me/${TELEGRAM_USERNAME}?text=Hello! I'm interested in starting a Free Trial for Vortex.`,
    },
    features: {
      list: [
        {
          icon: <Layers size={42} />,
          title: "ባለብዙ ቅርንጫፍ",
          description: "በቅጽበት የዕቃ ዝውውር እና ማዕከላዊ ቁጥጥር",
        },
        {
          icon: <Users size={42} />,
          title: "የሰራተኞች አስተዳደር",
          description: "ሚናዎች፣ መገኘት፣ ደመወዝ እና ቦነስ",
        },
        {
          icon: <Truck size={42} />,
          title: "ኃይለኛ ክምችት",
          description: "የክምችት ማንቂያ፣ ግዥ፣ መመለስ እና የተለያዩ ዋጋዎች",
        },
      ],
    },
    pricing: {
      title: "እቅድ ይምረጡ",
      contactSalesLink: `https://t.me/${TELEGRAM_USERNAME}?text=ሰላም! ስለ ኢንተርፕራይዝ እቅድ ማውራት እፈልጋለሁ።`,
      plans: [
        {
          name: "ሙከራ",
          target: "ለመሞከር",
          price: "ETB 0 ($0)",
          features: ["ለ30 ቀናት ብቻ", "1 ቅርንጫፍ", "3 ሰራተኞች", "መሰረታዊ ሽያጭ እና ክምችት"],
          cta: "በነጻ ይጀምሩ",
          telegramLink: `https://t.me/${TELEGRAM_USERNAME}?text=ሰላም! የነጻ ሙከራውን መጀመር እፈልጋለሁ።`,
        },
        {
          name: "ቤዚክ",
          target: "ለአንድ ሱቅ",
          price: { monthly: "ETB 1,400 ($9)", yearly: "ETB 1,170 ($7.5)" },
          features: [
            "1 ቅርንጫፍ",
            "5 ሰራተኞች",
            "ያልተገደበ ምርት",
            "ሽያጭ፣ ግዥ እና ደንበኞች",
            "የሰራተኞች መገኘት",
          ],
          cta: "ቤዚክ ይምረጡ",
          telegramLink: `https://t.me/${TELEGRAM_USERNAME}?text=ሰላም! የቤዚክ እቅድ ተጠቃሚ መሆን እፈልጋለሁ።`,
        },
        {
          name: "ፕሮ",
          target: "ለሚያድጉ ንግዶች",
          price: { monthly: "ETB 4,200 ($27)", yearly: "ETB 3,500 ($22)" },
          popular: true,
          features: [
            "እስከ 5 ቅርንጫፎች",
            "20 ሰራተኞች",
            "የዕቃ ዝውውር",
            "የዋጋ አወጣጥ",
            "ወጪ እና ቦነስ",
            "ኦዲት ሎግ",
          ],
          cta: "ፕሮ ይምረጡ",
          telegramLink: `https://t.me/${TELEGRAM_USERNAME}?text=ሰላም! የፕሮ እቅድ ተጠቃሚ መሆን እፈልጋለሁ።`,
        },
        {
          name: "ኢንተርፕራይዝ",
          target: "ለትላልቅ ድርጅቶች",
          price: "ETB 9,000 ($57)",
          features: [
            "ያልተገደበ ቅርንጫፍ እና ሰራተኛ",
            "HR እና ደመወዝ",
            "API Access",
            "ቅድሚያ ድጋፍ",
            "ተጨማሪ ተግባራት",
          ],
          cta: "ያነጋግሩን",
          telegramLink: `https://t.me/${TELEGRAM_USERNAME}?text=ሰላም! ስለ ኢንተርፕራይዝ እቅድ ዝርዝር መረጃ እፈልጋለሁ።`,
        },
      ],
    },
    faq: {
      title: "ተደጋጋሚ ጥያቄዎች",
      questions: [
        {
          q: "ክፍያ እንዴት መፈጸም እችላለሁ?",
          a: "በንግድ ባንክ፣ በቴሌብር እና በሌሎች የሀገር ውስጥ ባንኮች ክፍያ መፈጸም ይቻላል።",
        },
        {
          q: "መረጃዬ ምን ያህል ደህንነቱ የተጠበቀ ነው?",
          a: "መረጃዎ በዘመናዊ የደህንነት ቴክኖሎጂ የተጠበቀ ነው። ሽያጭዎ እና የክምችት መረጃዎ ለእርስዎ እና እርስዎ ለፈቀዱላቸው ሰራተኞች ብቻ ነው የሚታየው።",
        },
        {
          q: "ኢንተርኔት በሌለበት ሰዓት ይሰራል?",
          a: "ቮርቴክስ ቅርንጫፎችን በቅጽበት ለማገናኘት ኢንተርኔት ይፈልጋል፤ ነገር ግን በጣም ደካማ በሆነ ኮኔክሽን (2G/3G) እንዲሰራ ተደርጎ የተገነባ ነው።",
        },
        {
          q: "ለሰራተኞቼ ስልጠና ትሰጣላችሁ?",
          a: "አዎ። ለስራ አስኪያጆች እና ለሂሳብ ሰራተኞች የ1 ሰዓት ነጻ ስልጠና እንሰጣለን።",
        },
      ],
    },
    contact: {
      title: "መልዕክት ይላኩ",
      subtitle: "በኢሜል ማውራት ይመርጣሉ? መልዕክት ይላኩልን፤ በ24 ሰዓት ውስጥ እንመልሳለን።",
      nameLabel: "ሙሉ ስም",
      emailLabel: "ኢሜል",
      messageLabel: "እንዴት እንርዳዎት?",
      sendBtn: "መልዕክት ላክ",
      successMsg: "መልዕክትዎ ደርሶናል! በቅርቡ እናገኝዎታለን።",
    },
    success: {
      title: "መልዕክትዎ ደርሶናል!",
      message: "ቮርቴክስን ስለመረጡ እናመሰግናለን።",
      subMessage: "ቡድናችን መረጃው ደርሶታል። እቅድ መርጠው ከሆነ እባክዎ በቴሌግራም ያነጋግሩን።",
      closeBtn: "ተመለስ",
    },
  },
};
