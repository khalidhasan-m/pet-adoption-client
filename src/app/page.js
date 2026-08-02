"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getFeaturedPets } from "@/lib/api";
import PetCard from "@/components/PetCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  FiHeart,
  FiShield,
  FiUsers,
  FiSmile,
  FiCheckCircle,
  FiArrowRight,
  FiFeather,
  FiSun,
} from "react-icons/fi";
import { FaPaw, FaDog, FaCat, FaHeartbeat } from "react-icons/fa";

export default function HomePage() {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedPets()
      .then((res) => {
        if (res.success) {
          setFeaturedPets(res.data);
        }
      })
      .catch((err) => console.error("Error fetching featured pets:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-hidden">
      {/* ─── Hero / Banner Section ──────────────────────────────── */}
      <section className="relative py-20 lg:py-32 flex items-center justify-center">
        {/* Blob background graphics */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border text-sm font-semibold shadow-sm"
                style={{
                  background: "var(--bg-glass)",
                  borderColor: "var(--border)",
                  color: "var(--accent)",
                }}
              >
                <FaPaw /> Every Pet Deserves A Loving Home
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Find Your New{" "}
                <span
                  style={{
                    background: "var(--accent-gradient)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Best Friend
                </span>{" "}
                Today
              </h1>

              <p
                className="text-lg md:text-xl mb-8 leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Connect with thousands of adorable dogs, cats, birds, and rabbits waiting for adoption. Give a homeless pet a second chance at happiness.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/pets" className="btn-primary text-lg px-8 py-4 no-underline">
                  <FaPaw /> Adopt Now
                </Link>
                <Link href="/dashboard/add-pet" className="btn-secondary text-lg px-8 py-4 no-underline">
                  Post a Pet Listing
                </Link>
              </div>

              {/* Stats Bar */}
              <div
                className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t"
                style={{ borderColor: "var(--border)" }}
              >
                <div>
                  <h3 className="text-3xl font-extrabold" style={{ color: "var(--accent)" }}>1,200+</h3>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>Pets Adopted</p>
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold" style={{ color: "var(--accent)" }}>450+</h3>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>Verified Shelters</p>
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold" style={{ color: "var(--accent)" }}>99%</h3>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>Happy Families</p>
                </div>
              </div>
            </motion.div>

            {/* Right Column Hero Image Grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img
                    src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80"
                    alt="Happy Dog"
                    className="w-full h-64 object-cover rounded-2xl shadow-lg border"
                    style={{ borderColor: "var(--border)" }}
                  />
                  <img
                    src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80"
                    alt="Cute Cat"
                    className="w-full h-48 object-cover rounded-2xl shadow-lg border"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
                <div className="space-y-4 pt-8">
                  <img
                    src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80"
                    alt="Playful Puppy"
                    className="w-full h-48 object-cover rounded-2xl shadow-lg border"
                    style={{ borderColor: "var(--border)" }}
                  />
                  <img
                    src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=80"
                    alt="Golden Retriever"
                    className="w-full h-64 object-cover rounded-2xl shadow-lg border"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Featured Pets Section (Dynamic Section) ─────────────── */}
      <section className="py-20" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title">Featured Pets For Adoption</h2>
            <p className="section-subtitle">
              Meet these loving companions who are looking for their permanent home.
            </p>
          </motion.div>

          {loading ? (
            <LoadingSpinner text="Fetching cute pets..." />
          ) : featuredPets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPets.map((pet) => (
                <PetCard key={pet._id} pet={pet} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaPaw className="mx-auto text-4xl mb-4" style={{ color: "var(--text-muted)" }} />
              <p className="text-lg font-medium" style={{ color: "var(--text-secondary)" }}>
                No pets available right now. Be the first to list one!
              </p>
              <Link href="/dashboard/add-pet" className="btn-primary mt-4 no-underline inline-flex">
                Add Pet Listing
              </Link>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/pets" className="btn-secondary text-lg px-8 py-3 no-underline inline-flex items-center gap-2">
              View All Pets <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Extra Static Section 1: Why Adopt Pets ─────────────── */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Why Adopt A Pet?</h2>
            <p className="section-subtitle">
              Adopting a pet changes lives — both theirs and yours. Here is why adoption is the best choice.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FiHeart className="text-3xl text-pink-500" />,
                title: "Save A Life",
                desc: "Millions of shelter pets wait for a home every year. Adoption opens up shelter space and saves lives.",
              },
              {
                icon: <FiShield className="text-3xl text-purple-500" />,
                title: "Vaccinated & Healthy",
                desc: "Most adopted pets come fully vaccinated, health-checked, and neutered by responsible owners or shelters.",
              },
              {
                icon: <FiSmile className="text-3xl text-yellow-500" />,
                title: "Unconditional Love",
                desc: "Rescued pets express overwhelming gratitude and affection to those who welcome them into their families.",
              },
              {
                icon: <FiUsers className="text-3xl text-green-500" />,
                title: "Fight Backyard Breeding",
                desc: "Adopting reduces demand from commercial breeding facilities and promotes ethical pet care standards.",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center rounded-2xl"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: "var(--bg-tertiary)" }}
                >
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Extra Static Section 2: How It Works ────────────────── */}
      <section className="py-20" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">How PawfectMatch Works</h2>
            <p className="section-subtitle">
              Adopting a pet is quick, transparent, and hassle-free in 4 simple steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {[
              { step: "01", title: "Browse & Search", desc: "Filter by species, breed, location, or age to find your dream companion." },
              { step: "02", title: "Review Details", desc: "Read health status, vaccination details, and owner stories before requesting." },
              { step: "03", title: "Submit Request", desc: "Send an adoption request with your preferred pickup date and introduction message." },
              { step: "04", title: "Bring Home!", desc: "Once approved by the pet owner, coordinate pickup and welcome your new family member." },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative p-6 rounded-2xl border"
                style={{ background: "var(--bg-primary)", borderColor: "var(--border)" }}
              >
                <div
                  className="text-4xl font-black mb-4"
                  style={{
                    background: "var(--accent-gradient)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                  {item.title}
                </h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Extra Static Section 3: Success Stories ────────────── */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Heartwarming Success Stories</h2>
            <p className="section-subtitle">
              Read real stories from families whose lives were transformed by adopting a pet.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah & Max",
                pet: "Golden Retriever",
                img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
                story: "Max brought so much energy and joy into our home. PawfectMatch made the adoption process so smooth and comforting!",
              },
              {
                name: "David & Luna",
                pet: "Siamese Cat",
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
                story: "Luna was shy at first, but now she sleeps by my side every night. Adopting her was the best decision of my year.",
              },
              {
                name: "The Rahman Family",
                pet: "Rescue Bunny",
                img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
                story: "Our kids adore Coco! She is playful and sweet. Thank you to the shelter and PawfectMatch for connecting us.",
              },
            ].map((story, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card p-6 flex flex-col justify-between"
              >
                <p className="italic text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                  "{story.story}"
                </p>
                <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                  <img
                    src={story.img}
                    alt={story.name}
                    className="w-12 h-12 rounded-full object-cover border"
                    style={{ borderColor: "var(--accent)" }}
                  />
                  <div>
                    <h4 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>{story.name}</h4>
                    <p className="text-xs" style={{ color: "var(--accent)" }}>Adopted a {story.pet}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Extra Static Section 4: Pet Care Tips ───────────────── */}
      <section className="py-20" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Essential Pet Care Tips</h2>
            <p className="section-subtitle">
              First-time pet owner? Here are key advice points to ensure your new pet thrives.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Nutrition & Hydration",
                desc: "Provide age-appropriate, balanced pet food and always ensure clean, fresh water is accessible 24/7.",
                icon: <FaHeartbeat className="text-xl text-red-500" />,
              },
              {
                title: "Regular Vet Checkups",
                desc: "Schedule annual veterinary health exams, maintain vaccination schedules, and keep flea/tick prevention active.",
                icon: <FiCheckCircle className="text-xl text-green-500" />,
              },
              {
                title: "Mental & Physical Exercise",
                desc: "Daily walks for dogs, interactive puzzle toys for cats, and daily playtime prevent behavioral issues.",
                icon: <FiSun className="text-xl text-yellow-500" />,
              },
              {
                title: "Safe & Cozy Environment",
                desc: "Create a dedicated safe sleeping area, pet-proof electrical cords, and remove toxic indoor plants.",
                icon: <FiShield className="text-xl text-purple-500" />,
              },
            ].map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl flex items-start gap-4 border"
                style={{ background: "var(--bg-primary)", borderColor: "var(--border)" }}
              >
                <div className="p-3 rounded-xl flex-shrink-0" style={{ background: "var(--bg-tertiary)" }}>
                  {tip.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                    {tip.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {tip.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Extra Static Section 5: Call to Action Banner ───────── */}
      <section className="py-20 relative overflow-hidden">
        <div className="container">
          <div
            className="p-10 md:p-16 rounded-3xl text-center relative overflow-hidden shadow-2xl"
            style={{ background: "var(--accent-gradient)" }}
          >
            <div className="relative z-10 max-w-2xl mx-auto">
              <FaPaw className="text-5xl text-white/30 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Ready to Give a Pet a Forever Home?
              </h2>
              <p className="text-white/90 text-lg mb-8">
                Explore our catalog of available pets or register as a shelter/owner to post pet listings today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/pets"
                  className="bg-white text-purple-900 font-bold px-8 py-3.5 rounded-xl text-base no-underline hover:bg-gray-100 transition-transform hover:-translate-y-1 shadow-lg"
                >
                  Browse Available Pets
                </Link>
                <Link
                  href="/register"
                  className="border-2 border-white text-white font-bold px-8 py-3.5 rounded-xl text-base no-underline hover:bg-white/10 transition-transform hover:-translate-y-1"
                >
                  Create An Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
