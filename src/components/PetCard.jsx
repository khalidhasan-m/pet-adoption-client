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
      className="group relative flex flex-col h-full rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300"
    >
      {/* Image container */}
      <div className="relative w-full h-60 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={pet.image || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80"}
          alt={pet.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80";
          }}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Species badge */}
        <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-xs font-bold bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-800 dark:text-slate-200 border border-white/20 shadow-sm">
          {pet.species}
        </span>

        {/* Status badge */}
        <span
          className={`absolute top-3.5 right-3.5 px-3 py-1 rounded-full text-xs font-bold ${
            isAdopted
              ? "bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30"
              : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30"
          }`}
        >
          {isAdopted ? "Adopted" : "Available"}
        </span>

        {/* Fee Pill */}
        <div className="absolute bottom-3.5 right-3.5 px-3.5 py-1 rounded-xl text-sm font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md">
          {pet.adoptionFee === 0 ? "Free" : `$${pet.adoptionFee}`}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-grow justify-between bg-white dark:bg-slate-900">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 truncate tracking-tight">
              {pet.name}
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-lg font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {pet.gender}
            </span>
          </div>

          <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-4">
            {pet.breed}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 mb-5">
            <div className="flex items-center gap-1.5 font-medium">
              <FiClock className="text-purple-500" size={14} />
              <span>{pet.age} {pet.age === 1 ? "yr" : "yrs"} old</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium truncate">
              <FiMapPin className="text-purple-500" size={14} />
              <span className="truncate">{pet.location}</span>
            </div>
            <div className="col-span-2 flex items-center gap-1.5 font-medium pt-1">
              <FiTag className="text-purple-500" size={14} />
              <span className="truncate">Vaccination: {pet.vaccinationStatus}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link
            href={`/pets/${pet._id}`}
            className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-purple-600 dark:hover:bg-purple-600 text-white font-bold text-sm transition-all duration-200 no-underline flex items-center justify-center gap-2 shadow-sm"
          >
            <FiHeart size={16} /> View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
