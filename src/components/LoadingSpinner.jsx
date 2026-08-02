"use client";

import { FaPaw } from "react-icons/fa";

export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 gap-4">
      <div className="relative flex items-center justify-center">
        <div
          className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin"
          style={{
            borderColor: "rgba(124, 58, 237, 0.2)",
            borderTopColor: "var(--accent)",
          }}
        />
        <FaPaw
          className="absolute text-xl animate-pulse"
          style={{ color: "var(--accent)" }}
        />
      </div>
      {text && (
        <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          {text}
        </p>
      )}
    </div>
  );
}
