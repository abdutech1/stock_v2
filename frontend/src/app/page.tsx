
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Shirt,
  Users,
  Package,
  DollarSign,
  BarChart3,
  Clock,
  ArrowRight,
  Sparkles,
  Store,
  Globe,
  ShieldCheck
} from "lucide-react";

type Language = "am" | "en";

export default function Home() {
  const [language, setLanguage] = useState<Language>("am");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "am" ? "en" : "am"));
  };

  const t = translations[language];

  return (
    <div className="relative min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-fuchsia-50 overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-20 right-20 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header / Navbar */}
      <header className="relative z-10 backdrop-blur-md bg-white/75 border-b border-white/40 top-0">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-linear-to-br from-indigo-600 to-purple-600 text-white p-3 rounded-xl shadow-lg">
              <Store size={32} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-br from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                {t.title}
              </h1>
              <p className="text-sm text-gray-600 font-medium">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-700 transition-colors font-medium"
              title="Change language"
            >
              <Globe size={20} />
              <span className="text-sm font-semibold">
                {language === "am" ? "English" : "አማርኛ"}
              </span>
            </button>

            <Link
              href="/login"
              className="hidden sm:block px-6 py-2.5 rounded-full border-2 border-indigo-600 text-indigo-700 hover:bg-indigo-50 font-medium transition-colors"
            >
              {t.signIn}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-32 md:pt-24 md:pb-48 px-6">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full mb-8 shadow-md border border-white/60">
              <Sparkles size={20} className="text-purple-600" />
              <span className="text-base font-semibold text-purple-800">
                {t.hero.tag}
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 bg-linear-to-br from-indigo-700 via-purple-700 to-pink-600 bg-clip-text text-transparent">
              {t.hero.welcome}
              <br />
              {t.title}
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-12 leading-relaxed">
              {t.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/login"
                className="group relative px-10 py-5 bg-linear-to-br from-indigo-600 to-purple-600 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                {t.hero.ctaPrimary}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={28} />
              </Link>

              {/* <Link
                href="/login?role=owner"
                className="px-10 py-5 bg-white text-indigo-700 text-xl font-semibold rounded-2xl border-2 border-indigo-200 shadow-lg hover:bg-indigo-50 hover:border-indigo-400 transition-all flex items-center justify-center gap-3"
              >
                {t.hero.ctaOwner}
              </Link> */}
            </div>

            <div className="mt-12 text-base text-gray-600 flex flex-wrap justify-center gap-8 md:gap-12">
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-green-600" />
                <span>{t.features.fast}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-green-600" />
                <span>{t.features.secure}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={20} className="text-green-600" />
                <span>{t.features.staff}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Features */}
      <section className="relative py-20 px-6 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-linear-to-br from-indigo-700 to-purple-700 bg-clip-text text-transparent mb-4">
              {t.features.title}
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.features.list.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/90 rounded-2xl p-8 shadow-lg border border-gray-100 hover:border-purple-300 hover:shadow-xl transition-all group backdrop-blur-sm"
              >
                <div className="w-16 h-16 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* <div className="text-center mt-16">
            <p className="text-xl text-gray-700 font-medium">
              {t.ownerLabel}: <strong>{t.ownerName}</strong> • {t.ownerPhone}
            </p>
          </div> */}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-gray-200 bg-white/70 backdrop-blur-sm py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p className="text-lg">
            {t.footer.copyright} © {new Date().getFullYear()} • {t.footer.rights}
          </p>
          <p className="mt-3">
            {t.footer.support}: 0934 993 955 • 0940 139 361
          </p>
          <p className="mt-2 text-sm">{t.footer.developed}</p>
        </div>
      </footer>
    </div>
  );
}

// Translation object
const translations = {
  am: {
    title: "Jemo Boutique",
    subtitle: "ምቹና ዘመናዊ ፋሽን",
    signIn: "ግባ (Sign In)",
    hero: {
      tag: "Jemo Boutique Management System",
      welcome: "እንኳን በደህና መጡ!",
      description:
        "ሽያጭ • እቃ መጋዘን • ሰራተኞች • ደመወዝ • ሪፖርት • ወጪዎች\nሁሉም በአንድ ቦታ — ፈጣን፣ ቀላል፣ ደህንነቱ የተጠበቀ",
      ctaPrimary: "አሁን ግባ",
      ctaOwner: "ባለቤት መግቢያ",
    },
    features: {
      title: "ምን ማድረግ ይችላሉ?",
      subtitle: "የጄሞ ቡቲክ ዕለታዊ ሥራዎችን ቀላልና ፈጣን የሚያደርግ ሲስተም",
      fast: "በፍጥነት ይሰራል",
      secure: "ደህንነቱ የተጠበቀ",
      staff: "ለሁሉም ሰራተኞች",
      list: [
        {
          icon: <ShoppingBag size={32} />,
          title: "ፈጣን ሽያጭ",
          description: "በሰከንዶች ውስጥ ሽያጭ መመዝገብ፣ ቅናሽ፣ ብድር፣ የዕለት ማጠቃለያ",
        },
        {
          icon: <Shirt size={32} />,
          title: "እቃ መጋዘን አስተዳደር",
          description: "የእቃ መጠን በቅጽበት መከታተል፣ ዝቅተኛ ማስጠንቀቂያ፣ መጠንና ቀለም መለየት",
        },
        {
          icon: <Users size={32} />,
          title: "ሰራተኞች አስተዳደር",
          description: "መገኘት፣ ደመወዝ፣ ቦነስ፣ ቅድሚያ ክፍያ፣ የሥራ አፈጻጸም ሪፖርት",
        },
        {
          icon: <BarChart3 size={32} />,
          title: "ሪፖርቶችና ትንታኔ",
          description: "ዕለታዊ፣ ሳምንታዊ፣ ወርሃዊ ሽያጭ • በጣም የሚሸጡ እቃዎች • ትርፍና ኪሳራ",
        },
        {
          icon: <DollarSign size={32} />,
          title: "ፋይናንስ መቆጣጠሪያ",
          description: "ወጪዎችን መከታተል፣ የጥሬ ገንዘብ ፍሰት፣ የደመወዝ ቅድመ እይታ",
        },
        {
          icon: <Package size={32} />,
          title: "ደህንነትና ቁጥጥር",
          description: "ሚና መሰረት መግባት፣ የስልክ ቁጥር መለያ፣ ሙሉ የታሪክ መዝገብ",
        },
      ],
    },
    ownerLabel: "ባለቤት",
    ownerName: "Abdulkadir Akmel",
    ownerPhone: "ስልክ፡ 0932 121 559",
    footer: {
      copyright: "Jemo Boutique",
      rights: "ሁሉም መብቶች የተጠበቁ ናቸው",
      support: "ለእርዳታ",
      developed: "Developed  by: Abdulkadir Akmel 📱 0932 121 559",
    },
  },

  en: {
    title: "Jemo Boutique",
    subtitle: "Modern & Comfortable Fashion",
    signIn: "Sign In",
    hero: {
      tag: "Jemo Boutique Management System",
      welcome: "Welcome!",
      description:
        "Sales • Inventory • Staff • Salaries • Reports • Expenses\nAll in one place — Fast, Simple, Secure",
      ctaPrimary: "Sign In Now",
      ctaOwner: "Owner Login",
    },
    features: {
      title: "What You Can Do",
      subtitle: "A simple and fast system for managing daily operations of Jemo Boutique",
      fast: "Works quickly",
      secure: "Secure & Safe",
      staff: "For all staff members",
      list: [
        {
          icon: <ShoppingBag size={32} />,
          title: "Fast Sales",
          description: "Record sales in seconds, discounts, credit sales, daily summaries",
        },
        {
          icon: <Shirt size={32} />,
          title: "Inventory Management",
          description: "Real-time stock levels, low stock alerts, size & color variants",
        },
        {
          icon: <Users size={32} />,
          title: "Staff Management",
          description: "Attendance, salaries, bonuses, advances, performance reports",
        },
        {
          icon: <BarChart3 size={32} />,
          title: "Reports & Analytics",
          description: "Daily, weekly, monthly sales • Best sellers • Profit & loss",
        },
        {
          icon: <DollarSign size={32} />,
          title: "Financial Control",
          description: "Track expenses, cash flow, salary previews",
        },
        {
          icon: <Package size={32} />,
          title: "Security & Control",
          description: "Role-based access, phone login, full activity history",
        },
      ],
    },
    ownerLabel: "Owner",
    ownerName: "Abdulkadir Akmel",
    ownerPhone: "Phone: 0932 121 559",
    footer: {
      copyright: "Jemo Boutique",
      rights: "All rights reserved",
      support: "For support",
      developed: "Developed  by: Abdulkadir Akmel 📱 0932 121 559",
    },
  },
};