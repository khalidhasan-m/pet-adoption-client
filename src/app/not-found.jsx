"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { FaPaw } from "react-icons/fa";
import { FiHome, FiSearch } from "react-icons/fi";

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 relative overflow-hidden text-center bg-white dark:bg-slate-950">
      <div className="blob blob-purple w-96 h-96 -top-24 -right-24" />
      <div className="blob blob-pink w-80 h-80 -bottom-20 -left-20" />

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        className="relative z-10 max-w-lg w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 shadow-2xl shadow-slate-900/10">

        <div className="w-20 h-20 rounded-3xl bg-linear-to-tr from-violet-600 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-violet-500/30">
          <FaPaw className="text-4xl text-white animate-bounce" />
        </div>

        <h1 className="text-7xl font-black bg-linear-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent mb-4">
          404
        </h1>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
          Oops! Page Lost In The Woods
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8 max-w-sm mx-auto">
          The page you are looking for doesn&apos;t exist or has been moved. Even our best tracking dogs couldn&apos;t sniff it out!
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button href="/" variant="primary" size="lg" startContent={<FiHome />}>
            Back to Home
          </Button>

          <Button href="/pets" variant="outline" size="lg" startContent={<FiSearch />}>
            Browse Pets
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

