"use client";

import PrivateRoute from "@/components/PrivateRoute";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiList, FiPlusCircle, FiHeart } from "react-icons/fi";
import { FaPaw } from "react-icons/fa";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const sidebarLinks = [
    { href: "/dashboard/my-listings", label: "My Listings", icon: <FiList size={18} /> },
    { href: "/dashboard/my-requests", label: "My Requests", icon: <FiHeart size={18} /> },
    { href: "/dashboard/add-pet", label: "Add Pet", icon: <FiPlusCircle size={18} /> },
  ];

  return (
    <PrivateRoute>
      <div className="py-8">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-3">
              <div className="glass-card p-6 rounded-2xl sticky top-24" style={{ background: "var(--bg-secondary)" }}>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b" style={{ borderColor: "var(--border)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: "var(--accent-gradient)" }}>
                    <FaPaw />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                      Dashboard
                    </h3>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Manage your listings & requests</p>
                  </div>
                </div>

                <nav className="flex flex-col gap-2">
                  {sidebarLinks.map((link) => {
                    const active = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm no-underline transition-all"
                        style={{
                          background: active ? "var(--accent-gradient)" : "transparent",
                          color: active ? "#ffffff" : "var(--text-secondary)",
                          boxShadow: active ? "var(--shadow-glow)" : "none",
                        }}
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="lg:col-span-9">{children}</main>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}
