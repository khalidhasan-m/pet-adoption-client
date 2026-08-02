"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiMapPin, FiHeart, FiTag, FiClock } from "react-icons/fi";

export default function PetCard({ pet }) {
  if (!pet) return null;

  const isAdopted = pet.status === "adopted";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="glass-card overflow-hidden flex flex-col h-full group"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border)",
      }}
    >
      {/* Image container */}
      <div className="relative w-full h-56 overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={pet.image || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80"}
          alt={pet.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80";
          }}
        />

        {/* Species badge */}
        <span
          className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm"
          style={{
            background: "var(--bg-glass)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
          }}
        >
          {pet.species}
        </span>

        {/* Status badge */}
        <span
          className={`absolute top-3 right-3 badge ${
            isAdopted ? "badge-adopted" : "badge-available"
          }`}
        >
          {isAdopted ? "Adopted" : "Available"}
        </span>

        {/* Fee Pill */}
        <div
          className="absolute bottom-3 right-3 px-3 py-1 rounded-lg text-sm font-bold shadow-md"
          style={{
            background: "var(--accent-gradient)",
            color: "#ffffff",
          }}
        >
          {pet.adoptionFee === 0 ? "Free" : `$${pet.adoptionFee}`}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3
              className="text-xl font-bold truncate"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--text-primary)",
              }}
            >
              {pet.name}
            </h3>
            <span
              className="text-xs px-2.5 py-1 rounded-md font-medium"
              style={{
                background: "var(--bg-tertiary)",
                color: "var(--text-secondary)",
              }}
            >
              {pet.gender}
            </span>
          </div>

          <p className="text-sm font-medium mb-3" style={{ color: "var(--accent)" }}>
            {pet.breed}
          </p>

          <div className="flex flex-wrap gap-y-2 text-xs mb-4" style={{ color: "var(--text-muted)" }}>
            <div className="flex items-center gap-1 w-1/2">
              <FiClock size={14} style={{ color: "var(--text-secondary)" }} />
              <span>{pet.age} {pet.age === 1 ? "year" : "years"} old</span>
            </div>
            <div className="flex items-center gap-1 w-1/2 truncate">
              <FiMapPin size={14} style={{ color: "var(--text-secondary)" }} />
              <span className="truncate">{pet.location}</span>
            </div>
            <div className="flex items-center gap-1 w-full mt-1">
              <FiTag size={14} style={{ color: "var(--text-secondary)" }} />
              <span className="truncate">Vaccination: {pet.vaccinationStatus}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t" style={{ borderColor: "var(--border)" }}>
          <Link
            href={`/pets/${pet._id}`}
            className="btn-primary w-full text-center text-sm py-2.5 no-underline flex items-center justify-center gap-2"
          >
            <FiHeart size={16} /> View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
