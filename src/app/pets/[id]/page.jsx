"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getPetById, submitAdoptionRequest } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Chip } from "@heroui/react";
import { Input, TextArea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  FiMapPin, FiCalendar, FiHeart, FiShield, FiUser,
  FiMail, FiInfo, FiClock, FiMessageSquare,
} from "react-icons/fi";
import { FaPaw } from "react-icons/fa";

export default function PetDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    getPetById(id)
      .then((res) => {
        if (res.success) setPet(res.data);
        else { toast.error("Pet not found."); router.push("/pets"); }
      })
      .catch(() => toast.error("Failed to load pet details."))
      .finally(() => setLoading(false));
  }, [id, router]);

  const isOwner = user && pet && user.id === pet.ownerId;
  const isAdopted = pet?.status === "adopted";

  const handleAdoptionSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Please log in first."); router.push(`/login?redirect=/pets/${id}`); return; }
    if (isOwner) return toast.error("You cannot adopt your own pet.");
    if (isAdopted) return toast.error("This pet has already been adopted.");
    if (!pickupDate) return toast.error("Please select a preferred pickup date.");

    setRequestLoading(true);
    try {
      const res = await submitAdoptionRequest({ petId: pet._id, pickupDate, message });
      if (res.success) {
        toast.success(res.message || "Adoption request submitted! 🐾");
        setPickupDate(""); setMessage("");
        router.push("/dashboard/my-requests");
      } else { toast.error(res.message || "Failed to submit request."); }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit adoption request.");
    } finally { setRequestLoading(false); }
  };

  if (loading) return <LoadingSpinner text="Loading pet details..." />;
  if (!pet) return null;

  const specs = [
    { icon: <FiClock size={18} className="text-violet-500 mx-auto mb-1" />, label: "Age", value: `${pet.age} ${pet.age === 1 ? "Year" : "Years"}` },
    { icon: <FiUser size={18} className="text-violet-500 mx-auto mb-1" />, label: "Gender", value: pet.gender },
    { icon: <FiMapPin size={18} className="text-violet-500 mx-auto mb-1" />, label: "Location", value: pet.location },
    { icon: <FiShield size={18} className="text-violet-500 mx-auto mb-1" />, label: "Vaccination", value: pet.vaccinationStatus },
  ];

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* ─── Left: Pet Profile ─────────────────────────── */}
          <div className="lg:col-span-7 space-y-6">

            {/* Hero Image */}
            <div className="relative w-full h-[400px] sm:h-[480px] rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
              <img src={pet.image} alt={pet.name} className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80"; }} />
              <div className="absolute top-4 right-4">
                <Chip color={isAdopted ? "secondary" : "success"} variant="solid" size="md" className="font-bold text-xs px-3">
                  {isAdopted ? "Already Adopted" : "Available For Adoption"}
                </Chip>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">{pet.name}</h1>
                  <p className="text-lg font-semibold text-violet-600 dark:text-violet-400 mt-1">{pet.breed} · {pet.species}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Adoption Fee</span>
                  <p className="text-3xl font-black text-violet-600 dark:text-violet-400">
                    {pet.adoptionFee === 0 ? "Free 🎁" : `$${pet.adoptionFee}`}
                  </p>
                </div>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-slate-100 dark:border-slate-800 my-2">
                {specs.map(({ icon, label, value }) => (
                  <div key={label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                    {icon}
                    <span className="text-xs block text-slate-400 dark:text-slate-500 mb-0.5">{label}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 block truncate">{value}</span>
                  </div>
                ))}
              </div>

              {/* Health & Description */}
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                    <FiShield className="text-violet-500" /> Health Status
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
                    {pet.healthStatus}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                    <FiInfo className="text-violet-500" /> About {pet.name}
                  </h3>
                  <p className="text-sm leading-relaxed whitespace-pre-line text-slate-600 dark:text-slate-400">
                    {pet.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Right: Adoption Form Panel ────────────────── */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">

              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100 dark:border-slate-800">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-violet-500/25">
                  <FaPaw />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Adoption Application</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Request to adopt {pet.name}</p>
                </div>
              </div>

              {/* Adopted */}
              {isAdopted ? (
                <div className="text-center py-8 px-4 rounded-2xl bg-violet-50 dark:bg-violet-950/30">
                  <FaPaw className="mx-auto text-4xl mb-3 text-violet-500" />
                  <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">Pet Already Adopted</h4>
                  <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">{pet.name} has found a happy home! Check out other pets available for adoption.</p>
                  <Button radius="lg" size="sm" className="mt-4 bg-gradient-to-r from-violet-600 to-pink-500 text-white font-bold" onPress={() => router.push("/pets")}>
                    Browse Other Pets
                  </Button>
                </div>

              /* Owner */
              ) : isOwner ? (
                <div className="text-center py-8 px-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20">
                  <FiInfo className="mx-auto text-4xl mb-3 text-amber-500" />
                  <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">Your Pet Listing</h4>
                  <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">You cannot adopt your own pet listing.</p>
                </div>

              /* Not logged in */
              ) : !user ? (
                <div className="text-center py-6">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
                    You must be logged in to submit an adoption request for {pet.name}.
                  </p>
                  <Button radius="lg" size="lg"
                    className="w-full bg-gradient-to-r from-violet-600 to-pink-500 text-white font-bold shadow-lg shadow-violet-500/25"
                    onPress={() => router.push(`/login?redirect=/pets/${id}`)}>
                    Log In to Adopt
                  </Button>
                </div>

              /* Adoption Form */
              ) : (
                <form onSubmit={handleAdoptionSubmit} className="space-y-4">
                  <Input label="Pet Name" value={pet.name} readOnly variant="bordered" radius="lg"
                    classNames={{ label: "font-semibold", input: "text-sm text-slate-400" }} />
                  <Input label="Your Name" value={user.name || ""} readOnly variant="bordered" radius="lg"
                    startContent={<FiUser className="text-slate-400" size={16} />}
                    classNames={{ label: "font-semibold", input: "text-sm text-slate-400" }} />
                  <Input label="Your Email" value={user.email || ""} readOnly variant="bordered" radius="lg"
                    startContent={<FiMail className="text-slate-400" size={16} />}
                    classNames={{ label: "font-semibold", input: "text-sm text-slate-400" }} />

                  <Input type="date" label="Preferred Pickup Date *" value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    startContent={<FiCalendar className="text-slate-400" size={16} />}
                    variant="bordered" radius="lg" required
                    classNames={{ label: "font-semibold", input: "text-sm" }} />

                  <TextArea label="Message for the Owner (Optional)"
                    placeholder="Tell the owner about yourself and why you'd be a great fit..."
                    value={message} onChange={(e) => setMessage(e.target.value)}
                    minRows={3} variant="bordered" radius="lg"
                    startContent={<FiMessageSquare className="text-slate-400 mt-1" size={16} />}
                    classNames={{ label: "font-semibold", input: "text-sm" }} />

                  <Button type="submit" isLoading={requestLoading} isDisabled={requestLoading} size="lg" radius="lg"
                    className="w-full bg-gradient-to-r from-violet-600 to-pink-500 text-white font-bold py-6 shadow-lg shadow-violet-500/25 mt-2"
                    startContent={!requestLoading && <FiHeart />}>
                    {!requestLoading && "Submit Adoption Request"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
