"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "am";
type Theme = "light" | "dark";

const translations = {
  en: {
    systemControl: "System Control",
    masterPanel: "Master Administrator Panel",
    onboardOrg: "Onboard Org",
    totalOrgs: "Total Orgs",
    activeUsers: "Active Users",
    systemStatus: "System Status",
    healthy: "Healthy",
    orgList: "Organization List",
    searchSlugs: "Search slugs...",
    tableOrg: "Organization",
    tablePlan: "Plan",
    tableBranches: "Branches",
    tableUsers: "Users",
    tableActions: "Actions",
    registeredEntities: "Registered Entities",
    acrossOrgs: "Across all organizations",
    allOperational: "All services operational",
    onboardNewOrg: "Onboard New Organization",
  adminName: "Admin Name",
  adminPhone: "Admin Phone",
  orgSlug: "Organization Slug (Unique)",
  cancel: "Cancel",
  submit: "Submit",
  upgrading: "Upgrading Plan...",
  manage: "Manage",
  active: "Active",
  inactive: "Inactive",
  selectPlan: "Select Plan",
    free: "Free",
    basic: "Basic",
    pro: "Pro",
    enterprise: "Enterprise",
  },
  am: {
    systemControl: "የስርዓት ቁጥጥር",
    masterPanel: "ዋና የአስተዳዳሪ ፓነል",
    onboardOrg: "ድርጅት መመዝገብ",
    totalOrgs: "ጠቅላላ ድርጅቶች",
    activeUsers: "ንቁ ተጠቃሚዎች",
    systemStatus: "የስርዓት ሁኔታ",
    healthy: "ጤናማ",
    orgList: "የድርጅቶች ዝርዝር",
    searchSlugs: "ስለግ ይፈልጉ...",
    tableOrg: "ድርጅት",
    tablePlan: "ፕላን",
    tableBranches: "ቅርንጫፎች",
    tableUsers: "ተጠቃሚዎች",
    tableActions: "ድርጊቶች",
    registeredEntities: "የተመዘገቡ ድርጅቶች",
    acrossOrgs: "በሁሉም ድርጅቶች ውስጥ",
    allOperational: "ሁሉም አገልግሎቶች እየሰሩ ነው",
    onboardNewOrg: "አዲስ ድርጅት መመዝገብ",
  adminName: "የአስተዳዳሪ ስም",
  adminPhone: "የአስተዳዳሪ ስልክ",
  orgSlug: "የድርጅት መለያ (ልዩ)",
  cancel: "ሰርዝ",
  submit: "መዝግብ",
  upgrading: "ፕላን በማሻሻል ላይ...",
  manage: "አስተዳድር",
  active: "ንቁ",
  inactive: "ያልነቃ",
  selectPlan: "ፕላን ይምረጡ",
    free: "ነፃ",
    basic: "ቤዚክ",
    pro: "ፕሮ",
    enterprise: "ኤንተርፕራይዝ",
  }
};

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  toggleLanguage: () => void;
  hasHydrated: boolean;
  t: typeof translations.en;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme>("light");
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    // 1. Theme Persistence
    const savedTheme = localStorage.getItem("vortex-theme") as Theme | null;
    if (savedTheme === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }

    // 2. Language Persistence
    const savedLang = localStorage.getItem("vortex-lang") as Language | null;
    if (savedLang) {
      setLanguage(savedLang);
    }

    // 3. Mark as Hydrated
    setHasHydrated(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("vortex-theme", newTheme);
  };

  const toggleLanguage = () => {
    const newLang = language === "en" ? "am" : "en";
    setLanguage(newLang);
    localStorage.setItem("vortex-lang", newLang);
  };

const t = translations[language];

  return (
    <AppContext.Provider value={{ language, setLanguage, theme, toggleTheme, toggleLanguage, hasHydrated,t }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};