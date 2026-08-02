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
      const params = {
        page,
        limit: 9,
      };

      if (search.trim()) params.search = search.trim();
      if (selectedSpecies.length > 0) params.species = selectedSpecies.join(",");

      if (sort === "price_asc") params.sort = "price_asc";
      else if (sort === "price_desc") params.sort = "price_desc";
      else if (sort === "age_asc") params.sort = "age_asc";
      else if (sort === "age_desc") params.sort = "age_desc";
      else if (sort === "name_asc") params.sort = "name_asc";
      else if (sort === "name_desc") params.sort = "name_desc";

      const res = await getPets(params);
      if (res.success) {
        setPets(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error("Error loading pets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [page, selectedSpecies, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPets();
  };

  const toggleSpecies = (species) => {
    setPage(1);
    if (selectedSpecies.includes(species)) {
      setSelectedSpecies(selectedSpecies.filter((s) => s !== species));
    } else {
      setSelectedSpecies([...selectedSpecies, species]);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedSpecies([]);
    setSort("newest");
    setPage(1);
  };

  return (
    <div className="py-12">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="section-title">Explore All Available Pets</h1>
          <p className="section-subtitle mb-0">
            Use the search, filters, and sorting tools below to find your perfect companion.
          </p>
        </div>

        {/* Search & Filter Control Panel */}
        <div
          className="glass-card p-6 mb-10 rounded-2xl"
          style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
        >
          {/* Top Row: Search Input + Sort Dropdown */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex-grow relative flex items-center">
              <FiSearch className="absolute left-4" style={{ color: "var(--text-muted)" }} size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search pets by name..."
                className="form-input pl-12 pr-24 py-3"
              />
              <button
                type="submit"
                className="btn-primary absolute right-1.5 py-2 px-4 text-xs"
              >
                Search
              </button>
            </form>

            {/* Sort Selection */}
            <div className="flex items-center gap-2 min-w-[220px]">
              <FiSliders style={{ color: "var(--text-secondary)" }} size={18} />
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="form-select py-3"
              >
                <option value="newest">Sort by: Newest First</option>
                <option value="price_asc">Fee: Low to High</option>
                <option value="price_desc">Fee: High to Low</option>
                <option value="age_asc">Age: Youngest First</option>
                <option value="age_desc">Age: Oldest First</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Species Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
            <span className="text-sm font-semibold flex items-center gap-1.5 mr-2" style={{ color: "var(--text-secondary)" }}>
              <FiFilter size={16} /> Filter Species:
            </span>

            {SPECIES_OPTIONS.map((spec) => {
              const isSelected = selectedSpecies.includes(spec);
              return (
                <button
                  key={spec}
                  onClick={() => toggleSpecies(spec)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-all ${
                    isSelected
                      ? "text-white border-transparent"
                      : "hover:border-purple-400"
                  }`}
                  style={{
                    background: isSelected ? "var(--accent-gradient)" : "var(--bg-tertiary)",
                    color: isSelected ? "#ffffff" : "var(--text-secondary)",
                    borderColor: isSelected ? "transparent" : "var(--border)",
                  }}
                >
                  {spec}
                </button>
              );
            })}

            {(search || selectedSpecies.length > 0 || sort !== "newest") && (
              <button
                onClick={clearFilters}
                className="ml-auto text-xs font-bold flex items-center gap-1 cursor-pointer border-none bg-transparent"
                style={{ color: "var(--error)" }}
              >
                <FiX size={14} /> Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Pets Grid */}
        {loading ? (
          <LoadingSpinner text="Searching for pets..." />
        ) : pets.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {pets.map((pet) => (
                <PetCard key={pet._id} pet={pet} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-14">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-3 rounded-xl border cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                >
                  <FiChevronLeft size={18} />
                </button>

                <span className="text-sm font-semibold px-4 py-2 rounded-xl" style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)" }}>
                  Page {pagination.page} of {pagination.pages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="p-3 rounded-xl border cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 glass-card rounded-3xl">
            <FaPaw className="mx-auto text-5xl mb-4" style={{ color: "var(--text-muted)" }} />
            <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              No Pets Found
            </h3>
            <p className="text-sm max-w-md mx-auto mb-6" style={{ color: "var(--text-secondary)" }}>
              We couldn't find any pets matching your current search or filter criteria. Try adjusting your keywords or clearing filters.
            </p>
            <button onClick={clearFilters} className="btn-primary">
              Reset Search & Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
