"use client";

import PrivateRoute from "@/components/PrivateRoute";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiList, FiPlusCircle, FiHeart } from "react-icons/fi";
import { FaPaw } from "react-icons/fa";

const sidebarLinks = [
  { href: "/dashboard/my-listings", label: "My Listings", icon: <FiList size={18} /> },
  { href: "/dashboard/my-requests", label: "My Requests", icon: <FiHeart size={18} /> },
  { href: "/dashboard/add-pet", label: "Add Pet", icon: <FiPlusCircle size={18} /> },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* ─── Sidebar ─────────────────────────────────── */}
            <aside className="lg:col-span-3">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sticky top-24 shadow-sm">

                {/* Brand */}
                <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center text-white shadow-sm">
                    <FaPaw />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Dashboard</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Manage listings & requests</p>
                  </div>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col gap-1.5">
                  {sidebarLinks.map((link) => {
                    const active = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm no-underline transition-all ${
                          active
                            ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-lg shadow-violet-500/25"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                        }`}
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* ─── Main Content ─────────────────────────────── */}
            <main className="lg:col-span-9">{children}</main>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}
