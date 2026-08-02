"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { createPet } from "@/lib/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Input, TextArea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FiPlusCircle, FiImage, FiMapPin, FiDollarSign, FiUser, FiBookOpen } from "react-icons/fi";
import { FaPaw } from "react-icons/fa";

const SPECIES_LIST = ["Dog", "Cat", "Bird", "Rabbit", "Fish", "Hamster", "Turtle", "Other"];
const VACCINATION_OPTIONS = ["Up to date", "Partial", "None"];
const GENDER_OPTIONS = ["Male", "Female"];

export default function AddPetPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "", species: "Dog", breed: "", age: "", gender: "Male",
    image: "", healthStatus: "", vaccinationStatus: "Up to date",
    location: "", adoptionFee: "", description: "",
  });
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setFormData((prev) => ({ ...prev, [field]: e.target?.value ?? e }));
  const setNativeSelect = (field) => (e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, species, breed, age, gender, image, healthStatus, location, adoptionFee, description } = formData;
    if (!name || !species || !breed || !age || !gender || !image || !healthStatus || !location || adoptionFee === "" || !description) {
      return toast.error("Please fill in all required fields.");
    }
    setLoading(true);
    try {
      const payload = { ...formData, age: Number(age), adoptionFee: Number(adoptionFee) };
      const res = await createPet(payload);
      if (res.success) {
        toast.success(res.message || "Pet listing added successfully! 🐾");
        router.push("/dashboard/my-listings");
      } else {
        toast.error(res.message || "Failed to add pet listing.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create pet listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-violet-500/25">
          <FiPlusCircle size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Post A New Pet Listing</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Fill out details to help a pet find a loving family.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Owner email (read-only) */}
        <Input
          label="Owner Email (Auto-filled)"
          value={session?.user?.email || ""}
          readOnly
          variant="bordered" radius="lg"
          startContent={<FiUser className="text-slate-400" size={16} />}
          classNames={{ label: "font-semibold text-slate-700 dark:text-slate-300", input: "text-sm text-slate-400" }}
        />

        {/* Name + Species */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Pet Name *" placeholder="e.g. Buddy" value={formData.name} onValueChange={set("name")}
            variant="bordered" radius="lg" required
            classNames={{ label: "font-semibold text-slate-700 dark:text-slate-300", input: "text-sm" }} />

          <div className="flex flex-col justify-center">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 ml-1">Species *</label>
            <select value={formData.species} onChange={setNativeSelect("species")} required
              className="w-full px-3 py-3 text-sm rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:outline-none focus:border-violet-500 transition-colors appearance-none">
              {SPECIES_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Breed + Age + Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Breed *" placeholder="e.g. Golden Retriever" value={formData.breed} onChange={set("breed")}
            variant="bordered" radius="lg" required
            classNames={{ label: "font-semibold text-slate-700 dark:text-slate-300", input: "text-sm" }} />

          <Input type="number" label="Age (years) *" placeholder="e.g. 2" value={formData.age} onChange={set("age")}
            variant="bordered" radius="lg" required min="0" step="0.5"
            classNames={{ label: "font-semibold text-slate-700 dark:text-slate-300", input: "text-sm" }} />

          <div className="flex flex-col justify-center">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 ml-1">Gender *</label>
            <select value={formData.gender} onChange={setNativeSelect("gender")} required
              className="w-full px-3 py-3 text-sm rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:outline-none focus:border-violet-500 transition-colors appearance-none">
              {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        {/* Image URL + Adoption Fee */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input type="url" label="Image URL *" placeholder="https://images.unsplash.com/..." value={formData.image} onChange={set("image")}
              startContent={<FiImage className="text-slate-400" size={16} />}
              variant="bordered" radius="lg" required
              classNames={{ label: "font-semibold text-slate-700 dark:text-slate-300", input: "text-sm" }} />
          </div>

          <Input type="number" label="Adoption Fee ($) *" placeholder="0 for free" value={formData.adoptionFee} onChange={set("adoptionFee")}
            startContent={<FiDollarSign className="text-slate-400" size={16} />}
            variant="bordered" radius="lg" required min="0"
            classNames={{ label: "font-semibold text-slate-700 dark:text-slate-300", input: "text-sm" }} />
        </div>

        {/* Health Status + Vaccination */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Health Status *" placeholder="e.g. Excellent, dewormed" value={formData.healthStatus} onChange={set("healthStatus")}
            variant="bordered" radius="lg" required
            classNames={{ label: "font-semibold text-slate-700 dark:text-slate-300", input: "text-sm" }} />

          <div className="flex flex-col justify-center">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 ml-1">Vaccination Status *</label>
            <select value={formData.vaccinationStatus} onChange={setNativeSelect("vaccinationStatus")} required
              className="w-full px-3 py-3 text-sm rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:outline-none focus:border-violet-500 transition-colors appearance-none">
              {VACCINATION_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>

        {/* Location */}
        <Input label="Location (City / Area) *" placeholder="e.g. Dhaka, Bangladesh" value={formData.location} onChange={set("location")}
          startContent={<FiMapPin className="text-slate-400" size={16} />}
          variant="bordered" radius="lg" required
          classNames={{ label: "font-semibold text-slate-700 dark:text-slate-300", input: "text-sm" }} />

        {/* Description */}
        <TextArea
          label="Pet Description *"
          placeholder="Describe the pet's personality, habits, and ideal home environment..."
          value={formData.description} onChange={set("description")}
          minRows={4} variant="bordered" radius="lg" required
          startContent={<FiBookOpen className="text-slate-400 mt-1" size={16} />}
          classNames={{ label: "font-semibold text-slate-700 dark:text-slate-300", input: "text-sm" }}
        />

        <Button type="submit" isLoading={loading} isDisabled={loading} size="lg" radius="lg"
          className="w-full bg-gradient-to-r from-violet-600 to-pink-500 text-white font-bold py-6 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
          startContent={!loading && <FaPaw />}>
          {!loading && "Publish Pet Listing"}
        </Button>
      </form>
    </motion.div>
  );
}
