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
    <header className="sticky top-0 z-50 border-b backdrop-blur-xl bg-white/75 dark:bg-slate-900/75 border-slate-200/80 dark:border-slate-800 transition-colors">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group no-underline">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
            className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 via-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/20"
          >
            <FaPaw className="text-xl" />
          </motion.div>
          <span className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent tracking-tight">
            PawfectMatch
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800/60 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 no-underline ${
                isActive(link.href)
                  ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {user &&
            privateLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 no-underline flex items-center gap-2 ${
                  isActive(link.href)
                    ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400"
                }`}
              >
                {link.icon} {link.label}
              </Link>
            ))}
        </div>

        {/* Right Section Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <motion.button
            whileTap={{ scale: 0.9, rotate: 180 }}
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
          </motion.button>

          {/* User Profile / Login */}
          {isPending ? (
            <div className="w-10 h-10 rounded-full animate-pulse bg-slate-200 dark:bg-slate-700" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-500 transition-all cursor-pointer"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500/30"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white font-bold flex items-center justify-center text-xs">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:block text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {user.name?.split(" ")[0]}
                </span>
                <FiChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${
                    profileOpen ? "rotate-180 text-purple-500" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/10 overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>

                    <div className="p-1.5 space-y-1">
                      <Link
                        href="/dashboard/my-listings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 dark:hover:text-purple-400 transition-colors no-underline"
                      >
                        <FiList size={16} /> My Listings
                      </Link>
                      <Link
                        href="/dashboard/my-requests"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 dark:hover:text-purple-400 transition-colors no-underline"
                      >
                        <FiHeart size={16} /> My Requests
                      </Link>
                      <Link
                        href="/dashboard/add-pet"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 dark:hover:text-purple-400 transition-colors no-underline"
                      >
                        <FiPlusCircle size={16} /> Add Pet
                      </Link>
                    </div>

                    <div className="p-1.5 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 w-full transition-colors cursor-pointer border-none bg-transparent"
                      >
                        <FiLogOut size={16} /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold text-sm shadow-md shadow-purple-500/25 hover:shadow-lg hover:shadow-purple-500/35 hover:-translate-y-0.5 transition-all no-underline"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg"
          >
            <div className="p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-semibold no-underline ${
                    isActive(link.href)
                      ? "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400"
                      : "text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {user &&
                privateLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold no-underline ${
                      isActive(link.href)
                        ? "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400"
                        : "text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    {link.icon} {link.label}
                  </Link>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {profileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
      )}
    </header>
  );
}
