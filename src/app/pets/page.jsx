"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getPets } from "@/lib/api";
import PetCard from "@/components/PetCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { FiSearch, FiFilter, FiSliders, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaPaw } from "react-icons/fa";

const SPECIES_OPTIONS = ["Dog", "Cat", "Bird", "Rabbit", "Fish", "Hamster", "Turtle", "Other"];

export default function AllPetsPage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState([]);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const fetchPets = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (search.trim()) params.search = search.trim();
      if (selectedSpecies.length > 0) params.species = selectedSpecies.join(",");
      if (sort !== "newest") params.sort = sort;
      const res = await getPets(params);
      if (res.success) { setPets(res.data); setPagination(res.pagination); }
    } catch (err) { console.error("Error loading pets:", err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPets(); }, [page, selectedSpecies, sort]);

  const handleSearchSubmit = (e) => { e.preventDefault(); setPage(1); fetchPets(); };

  const toggleSpecies = (species) => {
    setPage(1);
    setSelectedSpecies((prev) => prev.includes(species) ? prev.filter((s) => s !== species) : [...prev, species]);
  };

  const clearFilters = () => { setSearch(""); setSelectedSpecies([]); setSort("newest"); setPage(1); };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-3">Explore All Available Pets</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">Search, filter, and sort to find your perfect companion.</p>
        </div>

        {/* Filter Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 mb-10 shadow-sm">
          {/* Search + Sort Row */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <form onSubmit={handleSearchSubmit} className="flex-grow relative flex items-center">
              <FiSearch className="absolute left-4 text-slate-400" size={18} />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search pets by name..."
                className="w-full pl-11 pr-28 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
              <button type="submit" className="absolute right-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all">
                Search
              </button>
            </form>

            <div className="flex items-center gap-2.5 min-w-[220px]">
              <FiSliders className="text-slate-400 flex-shrink-0" size={18} />
              <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="w-full py-3.5 pl-3 pr-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer appearance-none">
                <option value="newest">Newest First</option>
                <option value="price_asc">Fee: Low to High</option>
                <option value="price_desc">Fee: High to Low</option>
                <option value="age_asc">Age: Youngest First</option>
                <option value="age_desc">Age: Oldest First</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
              </select>
            </div>
          </div>

          {/* Species Filter Chips */}
          <div className="flex flex-wrap items-center gap-2.5 pt-5 border-t border-slate-100 dark:border-slate-800">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mr-1">
              <FiFilter size={15} /> Species:
            </span>
            {SPECIES_OPTIONS.map((spec) => {
              const active = selectedSpecies.includes(spec);
              return (
                <button key={spec} onClick={() => toggleSpecies(spec)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    active ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white border-transparent shadow-sm" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-400"
                  }`}
                >
                  {spec}
                </button>
              );
            })}
            {(search || selectedSpecies.length > 0 || sort !== "newest") && (
              <button onClick={clearFilters} className="ml-auto text-xs font-bold text-rose-500 dark:text-rose-400 flex items-center gap-1 cursor-pointer bg-transparent border-none hover:text-rose-700 transition-colors">
                <FiX size={14} /> Clear All
              </button>
            )}
          </div>
        </div>

        {/* Pets Grid */}
        {loading ? <LoadingSpinner text="Searching for pets..." /> : pets.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {pets.map((pet) => <PetCard key={pet._id} pet={pet} />)}
            </div>
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-14">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer">
                  <FiChevronLeft size={18} />
                </button>
                <span className="text-sm font-bold px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer">
                  <FiChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <FaPaw className="mx-auto text-5xl mb-4 text-slate-300 dark:text-slate-600" />
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">No Pets Found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">Try adjusting your search or clear filters to explore all available pets.</p>
            <button onClick={clearFilters} className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold cursor-pointer border-none">Reset Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
