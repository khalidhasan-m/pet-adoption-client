"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaPaw } from "react-icons/fa";
import { FiHome, FiSearch } from "react-icons/fi";

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 relative overflow-hidden text-center">
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg glass-card p-10 rounded-3xl relative z-10"
      >
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl" style={{ background: "var(--accent-gradient)" }}>
          <FaPaw className="text-4xl text-white animate-bounce" />
        </div>

        <h1
          className="text-6xl font-black mb-3"
          style={{
            fontFamily: "var(--font-heading)",
            background: "var(--accent-gradient)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </h1>

        <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
          Oops! Page Lost In The Woods
        </h2>

        <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
          The page you are looking for doesn't exist or has been moved. Even our best tracking dogs couldn't sniff it out!
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-primary py-3 px-6 no-underline flex items-center gap-2">
            <FiHome /> Back to Home
          </Link>
          <Link href="/pets" className="btn-secondary py-3 px-6 no-underline flex items-center gap-2">
            <FiSearch /> Browse Pets
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
