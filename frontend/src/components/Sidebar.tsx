"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingCart,
  BarChart3,
  Package,
  Users,
  Scale,
  // Category,          // uncomment later if needed
} from "lucide-react";

const commonLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Sales", href: "/sales", icon: ShoppingCart },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

const ownerLinks = [
  { name: "Reconciliation", href: "/reconciliation", icon: Scale }, // NEW LINK
  { name: "Stock", href: "/stocks", icon: Package },
  { name: "Users", href: "/users", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { role } = useAuth();

  const isOwner = role === "OWNER";

  const links = [...commonLinks, ...(isOwner ? ownerLinks : [])];

  return (
    <aside className="hidden md:block w-72 bg-linear-to-br from-gray-950 to-gray-900 border-r border-gray-800/70 text-gray-200 h-screen overflow-y-auto sticky top-0 z-20">
      <div className="p-6">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
            <span className="font-bold text-xl">J</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Jemo Boutique
            </h1>
            <p className="text-xs text-gray-500">Management</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
          {links.map((link, index) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link key={link.href} href={link.href} passHref>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.07, duration: 0.4 }}
                  className={`
                    group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-linear-to-r from-indigo-600/20 to-purple-600/20 text-white border-l-4 border-indigo-500 font-semibold"
                        : "text-gray-300 hover:bg-gray-800/50 hover:text-white hover:border-l-4 hover:border-indigo-500/50"
                    }
                  `}
                >
                  <div
                    className={`
                      p-2 rounded-lg transition-colors
                      ${isActive ? "bg-indigo-600/30" : "bg-gray-800/40 group-hover:bg-indigo-600/30"}
                    `}
                  >
                    <Icon size={20} className={isActive ? "text-indigo-400" : "text-gray-400 group-hover:text-indigo-400"} />
                  </div>

                  <span>{link.name}</span>

                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Optional footer section */}
        <div className="mt-auto pt-10 pb-6 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Jemo Boutique</p>
          <p className="mt-1">All rights reserved</p>
        </div>
      </div>
    </aside>
  );
}