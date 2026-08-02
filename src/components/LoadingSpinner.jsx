"use client";

import { FaPaw } from "react-icons/fa";

export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 p-8 gap-4">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-purple-200 dark:border-purple-900 border-t-purple-600 animate-spin" />
        <FaPaw className="absolute text-xl text-purple-600 dark:text-purple-400 animate-pulse" />
      </div>
      {text && (
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{text}</p>
      )}
    </div>
  );
}
