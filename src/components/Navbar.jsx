"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "@/lib/auth-client";
import { useTheme } from "@/context/ThemeContext";
import {
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiPlusCircle,
  FiList,
  FiHeart,
} from "react-icons/fi";
import { FaPaw } from "react-icons/fa";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { data: session, isPending } = useSession();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const user = session?.user;

  const handleLogout = async () => {
    await signOut();
    setProfileOpen(false);
    router.push("/");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/pets", label: "All Pets" },
  ];

  const privateLinks = [
    { href: "/dashboard/my-requests", label: "My Requests", icon: <FiHeart size={16} /> },
    { href: "/dashboard/add-pet", label: "Add Pet", icon: <FiPlusCircle size={16} /> },
  ];

  const isActive = (href) => pathname === href;

  return (
    <header className="sticky top-0 z-50 border-b" style={{
      background: "var(--bg-glass)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderColor: "var(--border)",
    }}>
      <nav className="container flex items-center justify-between h-16 md:h-18">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline group">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
            className="p-2 rounded-xl"
            style={{ background: "var(--accent-gradient)" }}
          >
            <FaPaw className="text-white text-xl" />
          </motion.div>
          <span className="text-xl font-bold" style={{
            fontFamily: "var(--font-heading)",
            background: "var(--accent-gradient)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            PawfectMatch
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all no-underline"
              style={{
                color: isActive(link.href) ? "var(--accent)" : "var(--text-secondary)",
                background: isActive(link.href) ? "rgba(124, 58, 237, 0.1)" : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}

          {user && privateLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all no-underline flex items-center gap-1.5"
              style={{
                color: isActive(link.href) ? "var(--accent)" : "var(--text-secondary)",
                background: isActive(link.href) ? "rgba(124, 58, 237, 0.1)" : "transparent",
              }}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <motion.button
            whileTap={{ scale: 0.9, rotate: 180 }}
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border-none cursor-pointer"
            style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)" }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
          </motion.button>

          {/* Auth */}
          {isPending ? (
            <div className="w-9 h-9 rounded-full skeleton" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full border cursor-pointer transition-all"
                style={{
                  background: "var(--bg-secondary)",
                  borderColor: profileOpen ? "var(--accent)" : "var(--border)",
                }}
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: "var(--accent-gradient)" }}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:block text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {user.name?.split(" ")[0]}
                </span>
                <FiChevronDown size={14} style={{ color: "var(--text-muted)" }} className={`transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-xl border overflow-hidden"
                    style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", boxShadow: "var(--shadow-lg)", zIndex: 100 }}
                  >
                    <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{user.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link href="/dashboard/my-listings" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm no-underline transition-colors hover:bg-[var(--bg-tertiary)]"
                        style={{ color: "var(--text-secondary)" }}>
                        <FiList size={16} /> My Listings
                      </Link>
                      <Link href="/dashboard/my-requests" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm no-underline transition-colors hover:bg-[var(--bg-tertiary)]"
                        style={{ color: "var(--text-secondary)" }}>
                        <FiHeart size={16} /> My Requests
                      </Link>
                      <Link href="/dashboard/add-pet" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm no-underline transition-colors hover:bg-[var(--bg-tertiary)]"
                        style={{ color: "var(--text-secondary)" }}>
                        <FiPlusCircle size={16} /> Add Pet
                      </Link>
                    </div>
                    <div className="border-t py-1" style={{ borderColor: "var(--border)" }}>
                      <button onClick={handleLogout}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm w-full border-none cursor-pointer transition-colors hover:bg-[var(--bg-tertiary)]"
                        style={{ background: "transparent", color: "var(--error)" }}>
                        <FiLogOut size={16} /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/login" className="btn-primary btn-sm no-underline">
              Login
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2.5 rounded-xl border-none cursor-pointer"
            style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)" }}
          >
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t"
            style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
          >
            <div className="p-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium no-underline"
                  style={{
                    color: isActive(link.href) ? "var(--accent)" : "var(--text-secondary)",
                    background: isActive(link.href) ? "rgba(124, 58, 237, 0.1)" : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              ))}
              {user && privateLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium no-underline flex items-center gap-2"
                  style={{
                    color: isActive(link.href) ? "var(--accent)" : "var(--text-secondary)",
                    background: isActive(link.href) ? "rgba(124, 58, 237, 0.1)" : "transparent",
                  }}
                >
                  {link.icon} {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click-away for profile dropdown */}
      {profileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
      )}
    </header>
  );
}
