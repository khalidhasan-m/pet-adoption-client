"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getFeaturedPets } from "@/lib/api";
import PetCard from "@/components/PetCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { FiArrowRight, FiShield, FiSmile, FiUsers, FiHeart, FiCheckCircle, FiSun } from "react-icons/fi";
import { FaPaw, FaHeartbeat } from "react-icons/fa";

export default function HomePage() {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedPets()
      .then((res) => { if (res.success) setFeaturedPets(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-hidden">

      {/* ─── Hero / Banner ─────────────────────────────────────── */}
      <section className="relative py-20 lg:py-32 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="blob blob-purple w-96 h-96 -top-24 -right-24" />
        <div className="blob blob-pink w-80 h-80 -bottom-20 -left-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Left: Text */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 text-sm font-semibold border border-purple-200 dark:border-purple-800 mb-6">
                <FaPaw /> Every Pet Deserves A Loving Home
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-slate-100 mb-6 leading-[1.1] tracking-tight">
                Find Your New{" "}
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                  Best Friend
                </span>{" "}
                Today
              </h1>

              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-xl">
                Connect with thousands of adorable dogs, cats, birds, and rabbits waiting for adoption. Give a homeless pet a second chance at happiness.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/pets" className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 transition-all no-underline flex items-center gap-2">
                  <FaPaw /> Adopt Now
                </Link>
                <Link href="/dashboard/add-pet" className="px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-lg hover:border-purple-500 hover:-translate-y-1 transition-all no-underline">
                  Post a Pet Listing
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-10 border-t border-slate-100 dark:border-slate-800">
                {[["1,200+","Pets Adopted"],["450+","Verified Shelters"],["99%","Happy Families"]].map(([num, label]) => (
                  <div key={label}>
                    <h3 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">{num}</h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Image grid */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80" alt="Happy Dog" className="w-full h-64 object-cover rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800" />
                  <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80" alt="Cute Cat" className="w-full h-48 object-cover rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800" />
                </div>
                <div className="space-y-4 pt-8">
                  <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80" alt="Playful Puppy" className="w-full h-48 object-cover rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800" />
                  <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=80" alt="Golden Retriever" className="w-full h-64 object-cover rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Featured Pets (Dynamic) ────────────────────────────── */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 mb-4 tracking-tight">Featured Pets For Adoption</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Meet these loving companions looking for their permanent home.</p>
          </motion.div>

          {loading ? <LoadingSpinner text="Fetching cute pets..." /> : featuredPets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPets.map((pet) => <PetCard key={pet._id} pet={pet} />)}
            </div>
          ) : (
            <div className="text-center py-16">
              <FaPaw className="mx-auto text-5xl mb-4 text-slate-300 dark:text-slate-600" />
              <p className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-6">No pets available right now.</p>
              <Link href="/dashboard/add-pet" className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold no-underline inline-flex items-center gap-2">Add Pet Listing</Link>
            </div>
          )}

          <div className="text-center mt-14">
            <Link href="/pets" className="px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-lg hover:border-purple-500 transition-all no-underline inline-flex items-center gap-2">
              View All Pets <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Why Adopt Pets ─────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 mb-4 tracking-tight">Why Adopt A Pet?</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Adopting a pet changes lives — both theirs and yours.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <FiHeart className="text-3xl text-pink-500" />, title: "Save A Life", desc: "Millions of shelter pets wait for a home every year. Adoption opens up shelter space and saves lives." },
              { icon: <FiShield className="text-3xl text-purple-500" />, title: "Vaccinated & Healthy", desc: "Most adopted pets come fully vaccinated, health-checked, and neutered by responsible owners or shelters." },
              { icon: <FiSmile className="text-3xl text-yellow-500" />, title: "Unconditional Love", desc: "Rescued pets express overwhelming gratitude and affection to those who welcome them into their families." },
              { icon: <FiUsers className="text-3xl text-emerald-500" />, title: "Fight Backyard Breeding", desc: "Adopting reduces demand from commercial breeding facilities and promotes ethical pet care standards." },
            ].map((card, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-7 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform">{card.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{card.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ───────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 mb-4 tracking-tight">How PawfectMatch Works</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Adopting a pet is quick, transparent, and hassle-free in 4 simple steps.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Browse & Search", desc: "Filter by species, breed, location, or age to find your dream companion." },
              { step: "02", title: "Review Details", desc: "Read health status, vaccination details, and owner stories before requesting." },
              { step: "03", title: "Submit Request", desc: "Send an adoption request with your preferred pickup date and message." },
              { step: "04", title: "Bring Home!", desc: "Once approved by the owner, coordinate pickup and welcome your new family member." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="p-7 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all">
                <div className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Success Stories ────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 mb-4 tracking-tight">Heartwarming Success Stories</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Real stories from families whose lives were transformed by adopting a pet.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah & Max", pet: "Golden Retriever", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80", story: "Max brought so much energy and joy into our home. PawfectMatch made the adoption process so smooth and comforting!" },
              { name: "David & Luna", pet: "Siamese Cat", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80", story: "Luna was shy at first, but now she sleeps by my side every night. Adopting her was the best decision of my year." },
              { name: "The Rahman Family", pet: "Rescue Bunny", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80", story: "Our kids adore Coco! She is playful and sweet. Thank you to the shelter and PawfectMatch for connecting us." },
            ].map((story, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="p-7 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1 transition-all">
                <p className="italic text-sm leading-relaxed text-slate-600 dark:text-slate-400 mb-6">"{story.story}"</p>
                <div className="flex items-center gap-4 pt-5 border-t border-slate-100 dark:border-slate-800">
                  <img src={story.img} alt={story.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-500/40" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100">{story.name}</h4>
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Adopted a {story.pet}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pet Care Tips ──────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 mb-4 tracking-tight">Essential Pet Care Tips</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">First-time pet owner? Here are key advice points to ensure your new pet thrives.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Nutrition & Hydration", desc: "Provide age-appropriate, balanced pet food and always ensure clean, fresh water is accessible 24/7.", icon: <FaHeartbeat className="text-xl text-rose-500" /> },
              { title: "Regular Vet Checkups", desc: "Schedule annual veterinary health exams, maintain vaccination schedules, and keep flea/tick prevention active.", icon: <FiCheckCircle className="text-xl text-emerald-500" /> },
              { title: "Mental & Physical Exercise", desc: "Daily walks for dogs, interactive puzzle toys for cats, and daily playtime prevent behavioral issues.", icon: <FiSun className="text-xl text-yellow-500" /> },
              { title: "Safe & Cozy Environment", desc: "Create a dedicated safe sleeping area, pet-proof electrical cords, and remove toxic indoor plants.", icon: <FiShield className="text-xl text-purple-500" /> },
            ].map((tip, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="p-6 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-5 hover:shadow-md transition-all">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 flex-shrink-0">{tip.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{tip.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{tip.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative p-12 md:p-20 rounded-3xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 text-center overflow-hidden shadow-2xl shadow-purple-500/30">
            <div className="blob blob-blue w-64 h-64 top-1/2 left-1/3 opacity-20" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <FaPaw className="text-5xl text-white/30 mx-auto mb-4" />
              <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Ready to Give a Pet a Forever Home?</h2>
              <p className="text-lg text-white/85 mb-8">Explore our catalog of available pets or register as a shelter to post listings today.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/pets" className="px-8 py-4 rounded-2xl bg-white text-purple-700 font-bold text-base no-underline hover:bg-slate-50 hover:-translate-y-1 transition-all shadow-lg">Browse Available Pets</Link>
                <Link href="/register" className="px-8 py-4 rounded-2xl border-2 border-white/70 text-white font-bold text-base no-underline hover:bg-white/10 hover:-translate-y-1 transition-all">Create An Account</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
