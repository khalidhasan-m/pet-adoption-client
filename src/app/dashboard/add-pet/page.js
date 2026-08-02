"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { createPet } from "@/lib/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiPlusCircle, FiImage, FiMapPin, FiDollarSign, FiShield } from "react-icons/fi";
import { FaPaw } from "react-icons/fa";

const SPECIES_LIST = ["Dog", "Cat", "Bird", "Rabbit", "Fish", "Hamster", "Turtle", "Other"];

export default function AddPetPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    species: "Dog",
    breed: "",
    age: "",
    gender: "Male",
    image: "",
    healthStatus: "",
    vaccinationStatus: "Up to date",
    location: "",
    adoptionFee: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.species ||
      !formData.breed ||
      !formData.age ||
      !formData.gender ||
      !formData.image ||
      !formData.healthStatus ||
      !formData.location ||
      formData.adoptionFee === "" ||
      !formData.description
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        age: Number(formData.age),
        adoptionFee: Number(formData.adoptionFee),
      };

      const res = await createPet(payload);

      if (res.success) {
        toast.success(res.message || "Pet listing added successfully!");
        router.push("/dashboard/my-listings");
      } else {
        toast.error(res.message || "Failed to add pet listing.");
      }
    } catch (err) {
      console.error("Add pet error:", err);
      toast.error(err?.response?.data?.message || "Failed to create pet listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 rounded-3xl"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="flex items-center gap-3 mb-6 pb-4 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: "var(--accent-gradient)" }}>
          <FiPlusCircle size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
            Post A New Pet Listing
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Fill out the details below to help a pet find a new loving family.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Owner Email (Read-Only) */}
        <div>
          <label className="form-label">Owner Email (Auto-filled)</label>
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="form-input"
          />
        </div>

        {/* Basic Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Pet Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Buddy"
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Species *</label>
            <select
              name="species"
              value={formData.species}
              onChange={handleChange}
              className="form-select"
              required
            >
              {SPECIES_LIST.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="form-label">Breed *</label>
            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              placeholder="e.g. Golden Retriever"
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Age (in years) *</label>
            <input
              type="number"
              name="age"
              min="0"
              step="0.5"
              value={formData.age}
              onChange={handleChange}
              placeholder="e.g. 2"
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        {/* Image URL & Location & Fee */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="form-label">Image URL (imgbb / postimage / Unsplash) *</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Adoption Fee ($) *</label>
            <input
              type="number"
              name="adoptionFee"
              min="0"
              value={formData.adoptionFee}
              onChange={handleChange}
              placeholder="0 for free"
              className="form-input"
              required
            />
          </div>
        </div>

        {/* Health & Vaccination */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Health Status *</label>
            <input
              type="text"
              name="healthStatus"
              value={formData.healthStatus}
              onChange={handleChange}
              placeholder="e.g. Excellent health, dewormed"
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Vaccination Status *</label>
            <select
              name="vaccinationStatus"
              value={formData.vaccinationStatus}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="Up to date">Up to date</option>
              <option value="Partial">Partial</option>
              <option value="None">None</option>
            </select>
          </div>
        </div>

        <div>
          <label className="form-label">Location (City/Area) *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Dhaka, Bangladesh"
            className="form-input"
            required
          />
        </div>

        <div>
          <label className="form-label">Pet Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the pet's personality, habits, and ideal home environment..."
            className="form-textarea"
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-4 text-base font-bold flex items-center justify-center gap-2"
        >
          <FaPaw /> {loading ? "Publishing Listing..." : "Publish Pet Listing"}
        </button>
      </form>
    </motion.div>
  );
}
