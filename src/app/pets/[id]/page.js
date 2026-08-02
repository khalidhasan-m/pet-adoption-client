"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getPetById, submitAdoptionRequest } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiCalendar,
  FiHeart,
  FiShield,
  FiCheckCircle,
  FiUser,
  FiMail,
  FiInfo,
  FiClock,
  FiTag,
  FiDollarSign,
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

  // Adoption Form State
  const [pickupDate, setPickupDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    getPetById(id)
      .then((res) => {
        if (res.success) {
          setPet(res.data);
        } else {
          toast.error("Pet not found.");
          router.push("/pets");
        }
      })
      .catch((err) => {
        console.error("Error fetching pet details:", err);
        toast.error("Failed to load pet details.");
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  const isOwner = user && pet && user.id === pet.ownerId;
  const isAdopted = pet?.status === "adopted";

  const handleAdoptClick = () => {
    if (!user) {
      toast.error("Please login to submit an adoption request.");
      router.push(`/login?redirect=/pets/${id}`);
    }
  };

  const handleAdoptionSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to submit a request.");
      router.push(`/login?redirect=/pets/${id}`);
      return;
    }

    if (isOwner) {
      toast.error("You cannot adopt your own pet.");
      return;
    }

    if (isAdopted) {
      toast.error("This pet has already been adopted.");
      return;
    }

    if (!pickupDate) {
      toast.error("Please select a preferred pickup date.");
      return;
    }

    setRequestLoading(true);
    try {
      const res = await submitAdoptionRequest({
        petId: pet._id,
        pickupDate,
        message,
      });

      if (res.success) {
        toast.success(res.message || "Adoption request submitted successfully!");
        setPickupDate("");
        setMessage("");
        router.push("/dashboard/my-requests");
      } else {
        toast.error(res.message || "Failed to submit request.");
      }
    } catch (err) {
      console.error("Adoption error:", err);
      toast.error(err?.response?.data?.message || "Failed to submit adoption request.");
    } finally {
      setRequestLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading pet details..." />;
  }

  if (!pet) {
    return null;
  }

  return (
    <div className="py-12">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
        >
          {/* Left Column: Pet Profile Info (8 cols on lg) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Image */}
            <div className="relative w-full h-[400px] sm:h-[480px] rounded-3xl overflow-hidden shadow-xl border" style={{ borderColor: "var(--border)" }}>
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80";
                }}
              />
              <span
                className={`absolute top-4 right-4 badge ${
                  isAdopted ? "badge-adopted" : "badge-available"
                } text-sm px-4 py-1.5`}
              >
                {isAdopted ? "Already Adopted" : "Available For Adoption"}
              </span>
            </div>

            {/* Main Header Info */}
            <div className="glass-card p-8 rounded-3xl">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                    {pet.name}
                  </h1>
                  <p className="text-lg font-semibold mt-1" style={{ color: "var(--accent)" }}>
                    {pet.breed} ({pet.species})
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase block" style={{ color: "var(--text-muted)" }}>Adoption Fee</span>
                  <span className="text-3xl font-black" style={{ color: "var(--accent)" }}>
                    {pet.adoptionFee === 0 ? "Free" : `$${pet.adoptionFee}`}
                  </span>
                </div>
              </div>

              {/* Quick Spec Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y my-6" style={{ borderColor: "var(--border)" }}>
                <div className="p-3 rounded-xl text-center" style={{ background: "var(--bg-tertiary)" }}>
                  <FiClock className="mx-auto mb-1" style={{ color: "var(--accent)" }} size={18} />
                  <span className="text-xs block" style={{ color: "var(--text-muted)" }}>Age</span>
                  <span className="text-sm font-bold">{pet.age} {pet.age === 1 ? "Year" : "Years"}</span>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ background: "var(--bg-tertiary)" }}>
                  <FiUser className="mx-auto mb-1" style={{ color: "var(--accent)" }} size={18} />
                  <span className="text-xs block" style={{ color: "var(--text-muted)" }}>Gender</span>
                  <span className="text-sm font-bold">{pet.gender}</span>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ background: "var(--bg-tertiary)" }}>
                  <FiMapPin className="mx-auto mb-1" style={{ color: "var(--accent)" }} size={18} />
                  <span className="text-xs block" style={{ color: "var(--text-muted)" }}>Location</span>
                  <span className="text-sm font-bold truncate block">{pet.location}</span>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ background: "var(--bg-tertiary)" }}>
                  <FiShield className="mx-auto mb-1" style={{ color: "var(--accent)" }} size={18} />
                  <span className="text-xs block" style={{ color: "var(--text-muted)" }}>Vaccination</span>
                  <span className="text-sm font-bold truncate block">{pet.vaccinationStatus}</span>
                </div>
              </div>

              {/* Health & Description */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    <FiShield style={{ color: "var(--accent)" }} /> Health Status
                  </h3>
                  <p className="text-sm leading-relaxed p-4 rounded-xl" style={{ background: "var(--bg-primary)", color: "var(--text-secondary)" }}>
                    {pet.healthStatus}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    <FiInfo style={{ color: "var(--accent)" }} /> About {pet.name}
                  </h3>
                  <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--text-secondary)" }}>
                    {pet.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Adoption Request Panel / Form (5 cols on lg) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="glass-card p-8 rounded-3xl" style={{ background: "var(--bg-secondary)" }}>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: "var(--accent-gradient)" }}>
                  <FaPaw />
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                    Adoption Application
                  </h3>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Request to adopt {pet.name}
                  </p>
                </div>
              </div>

              {isAdopted ? (
                <div className="p-6 text-center rounded-2xl" style={{ background: "rgba(124, 58, 237, 0.1)" }}>
                  <FaPaw className="mx-auto text-4xl mb-3" style={{ color: "var(--accent)" }} />
                  <h4 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Pet Already Adopted</h4>
                  <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                    {pet.name} has found a happy home! Check out other pets available for adoption.
                  </p>
                </div>
              ) : isOwner ? (
                <div className="p-6 text-center rounded-2xl" style={{ background: "rgba(245, 158, 11, 0.1)" }}>
                  <FiInfo className="mx-auto text-4xl mb-3 text-amber-500" />
                  <h4 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Your Pet Listing</h4>
                  <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                    You are the owner of this listing. You cannot submit an adoption request for your own pet.
                  </p>
                </div>
              ) : !user ? (
                <div className="text-center py-6">
                  <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                    You must be logged in to submit an adoption request for {pet.name}.
                  </p>
                  <button onClick={handleAdoptClick} className="btn-primary w-full py-3.5 text-base">
                    Log In to Adopt
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAdoptionSubmit} className="space-y-4">
                  <div>
                    <label className="form-label">Pet Name</label>
                    <input
                      type="text"
                      value={pet.name}
                      readOnly
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Your Name</label>
                    <input
                      type="text"
                      value={user.name || ""}
                      readOnly
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Your Email</label>
                    <input
                      type="email"
                      value={user.email || ""}
                      readOnly
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Preferred Pickup Date *</label>
                    <input
                      type="date"
                      value={pickupDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Message / Note for Owner</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell the owner about yourself and why you'd be a great fit for this pet..."
                      className="form-textarea"
                      rows={3}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={requestLoading}
                    className="btn-primary w-full py-4 text-base font-bold flex items-center justify-center gap-2 mt-4"
                  >
                    <FiHeart size={18} />
                    {requestLoading ? "Submitting..." : "Submit Adoption Request"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
