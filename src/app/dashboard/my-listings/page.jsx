"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getMyListings, deletePet, updatePet,
  getPetRequests, approveRequest, rejectRequest,
} from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Chip } from "@heroui/react";
import { Input, TextArea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  FiEdit, FiTrash2, FiEye, FiInbox, FiCheckCircle,
  FiXCircle, FiPlusCircle, FiCalendar, FiMail,
} from "react-icons/fi";
import { FaPaw } from "react-icons/fa";

const SPECIES_LIST = ["Dog", "Cat", "Bird", "Rabbit", "Fish", "Hamster", "Turtle", "Other"];
const statusColor = { available: "success", adopted: "secondary", pending: "warning" };

export default function MyListingsPage() {
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState({ totalListings: 0, available: 0, adopted: 0 });
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Requests state
  const [activePet, setActivePet] = useState(null);
  const [petRequests, setPetRequests] = useState([]);
  const [reqLoading, setReqLoading] = useState(false);

  // Edit state
  const [editingPet, setEditingPet] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  // Delete state
  const [deletingPet, setDeletingPet] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchListings = async () => {
    try {
      const res = await getMyListings();
      if (res.success) { setListings(res.data); setStats(res.stats); }
    } catch { toast.error("Failed to load your pet listings."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchListings(); }, []);

  // ─── Requests ─────────────────────────────────────────────────
  const openRequests = async (pet) => {
    setActivePet(pet); setReqLoading(true); setPetRequests([]); setIsReqModalOpen(true);
    try {
      const res = await getPetRequests(pet._id);
      if (res.success) setPetRequests(res.data);
    } catch { toast.error("Failed to load requests."); }
    finally { setReqLoading(false); }
  };

  const handleApprove = async (id) => {
    try {
      const res = await approveRequest(id);
      if (res.success) { toast.success("Request approved! 🎉"); openRequests(activePet); fetchListings(); }
    } catch (e) { toast.error(e?.response?.data?.message || "Failed to approve."); }
  };

  const handleReject = async (id) => {
    try {
      const res = await rejectRequest(id);
      if (res.success) { toast.success("Request rejected."); openRequests(activePet); fetchListings(); }
    } catch (e) { toast.error(e?.response?.data?.message || "Failed to reject."); }
  };

  // ─── Edit ──────────────────────────────────────────────────────
  const openEdit = (pet) => {
    setEditingPet(pet);
    setEditForm({ name: pet.name, species: pet.species, breed: pet.breed, age: String(pet.age), gender: pet.gender, image: pet.image, healthStatus: pet.healthStatus, vaccinationStatus: pet.vaccinationStatus, location: pet.location, adoptionFee: String(pet.adoptionFee), description: pet.description });
    setIsEditModalOpen(true);
  };

  const setE = (f) => (e) => setEditForm((p) => ({ ...p, [f]: e.target?.value ?? e }));
  const setNativeES = (f) => (e) => setEditForm((p) => ({ ...p, [f]: e.target.value }));

  const handleEditSubmit = async (e) => {
    e.preventDefault(); setEditLoading(true);
    try {
      const res = await updatePet(editingPet._id, { ...editForm, age: Number(editForm.age), adoptionFee: Number(editForm.adoptionFee) });
      if (res.success) { toast.success("Pet updated! ✅"); setIsEditModalOpen(false); fetchListings(); }
    } catch (err) { toast.error(err?.response?.data?.message || "Failed to update."); }
    finally { setEditLoading(false); }
  };

  // ─── Delete ────────────────────────────────────────────────────
  const openDelete = (pet) => { setDeletingPet(pet); setIsDeleteModalOpen(true); };
  const handleDelete = async () => {
    if (!deletingPet) return; setDeleteLoading(true);
    try {
      const res = await deletePet(deletingPet._id);
      if (res.success) { toast.success("Listing deleted."); setIsDeleteModalOpen(false); setDeletingPet(null); fetchListings(); }
    } catch (err) { toast.error(err?.response?.data?.message || "Failed to delete."); }
    finally { setDeleteLoading(false); }
  };

  if (loading) return <LoadingSpinner text="Fetching your listings..." />;

  return (
    <div className="space-y-8">
      {/* Header + Stats */}
      <div>
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">My Pet Listings</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage posts, review adoption requests, or update details.</p>
          </div>
          <Button as={Link} href="/dashboard/add-pet" radius="lg" size="md"
            className="bg-gradient-to-r from-violet-600 to-pink-500 text-white font-bold shadow-md shadow-violet-500/20"
            startContent={<FiPlusCircle />}>
            Post New Pet
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { value: stats.totalListings, label: "Total Listings", icon: <FaPaw className="text-xl text-white" />, bg: "from-violet-600 to-pink-500" },
            { value: stats.available, label: "Available", icon: <FiCheckCircle className="text-xl text-emerald-500" />, bg: null, iconBg: "bg-emerald-50 dark:bg-emerald-950/40" },
            { value: stats.adopted, label: "Adopted", icon: <FaPaw className="text-xl text-violet-500" />, bg: null, iconBg: "bg-violet-50 dark:bg-violet-950/40" },
          ].map(({ value, label, icon, bg, iconBg }) => (
            <div key={label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${bg ? `bg-gradient-to-tr ${bg}` : iconBg}`}>{icon}</div>
              <div>
                <span className="text-2xl font-black text-slate-900 dark:text-slate-100 block">{value}</span>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence>
            {listings.map((pet) => (
              <motion.div key={pet._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="flex gap-4 mb-4">
                  <img src={pet.image} alt={pet.name}
                    className="w-24 h-24 rounded-xl object-cover border border-slate-200 dark:border-slate-800 flex-shrink-0"
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80"; }} />
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">{pet.name}</h3>
                      <Chip size="sm" color={statusColor[pet.status] || "default"} variant="flat" className="capitalize font-semibold text-xs">{pet.status}</Chip>
                    </div>
                    <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mt-1">{pet.species} • {pet.breed}</p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">
                      Fee: {pet.adoptionFee === 0 ? "Free 🎁" : `$${pet.adoptionFee}`}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Button size="sm" variant="flat" radius="md" onPress={() => openRequests(pet)} startContent={<FiInbox size={13} />} className="text-xs font-semibold">Requests</Button>
                  <Button as={Link} href={`/pets/${pet._id}`} size="sm" variant="flat" radius="md" startContent={<FiEye size={13} />} className="text-xs font-semibold">View</Button>
                  <Button size="sm" variant="flat" radius="md" onPress={() => openEdit(pet)} startContent={<FiEdit size={13} />} className="text-xs font-semibold">Edit</Button>
                  <Button size="sm" color="danger" variant="flat" radius="md" onPress={() => openDelete(pet)} startContent={<FiTrash2 size={13} />} className="text-xs font-semibold">Delete</Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
          <FaPaw className="mx-auto text-5xl mb-4 text-slate-300 dark:text-slate-600" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No Pet Listings Yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
            You haven't posted any pets yet. Create your first listing now!
          </p>
          <Button as={Link} href="/dashboard/add-pet" radius="lg" className="bg-gradient-to-r from-violet-600 to-pink-500 text-white font-bold shadow-md" startContent={<FiPlusCircle />}>Post First Pet Listing</Button>
        </div>
      )}

      {/* ─── Requests Modal ─── */}
      {isReqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 tracking-tight text-lg">
                Adoption Requests for <span className="text-violet-600">{activePet?.name}</span>
              </h3>
            </div>
            <div className="p-6 overflow-y-auto">
              {reqLoading ? <LoadingSpinner text="Fetching applications..." /> : petRequests.length > 0 ? (
                <div className="space-y-4">
                  {petRequests.map((req) => (
                    <div key={req._id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{req.userName}</span>
                          <Chip size="sm" color={statusColor[req.status] || "default"} variant="flat" className="capitalize font-semibold text-xs">{req.status}</Chip>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5"><FiMail size={12} /> {req.userEmail}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5"><FiCalendar size={12} /> Pickup: {new Date(req.pickupDate).toLocaleDateString()}</p>
                        {req.message && <p className="text-xs italic text-slate-400">"{req.message}"</p>}
                      </div>
                      {req.status === "pending" && (
                        <div className="flex gap-2 flex-shrink-0">
                          <Button size="sm" color="success" variant="flat" radius="md" onPress={() => handleApprove(req._id)} startContent={<FiCheckCircle size={13} />} className="font-semibold text-xs">Approve</Button>
                          <Button size="sm" color="danger" variant="flat" radius="md" onPress={() => handleReject(req._id)} startContent={<FiXCircle size={13} />} className="font-semibold text-xs">Reject</Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <FiInbox className="mx-auto text-4xl mb-2 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No adoption requests for this pet yet.</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end border-t border-slate-200 dark:border-slate-700">
              <Button variant="flat" radius="lg" onPress={() => setIsReqModalOpen(false)} className="font-semibold">Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Edit Modal ─── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 tracking-tight text-lg">
                Edit: <span className="text-violet-600">{editingPet?.name}</span>
              </h3>
            </div>
            <form onSubmit={handleEditSubmit} className="flex flex-col flex-grow overflow-hidden">
              <div className="p-6 space-y-4 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Pet Name" value={editForm.name || ""} onChange={setE("name")} variant="bordered" radius="lg" required classNames={{ label: "font-semibold" }} />
                  <div className="flex flex-col justify-center">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 ml-1">Species</label>
                    <select value={editForm.species || "Dog"} onChange={setNativeES("species")}
                      className="w-full px-3 py-3 text-sm rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:outline-none focus:border-violet-500 transition-colors appearance-none">
                      {SPECIES_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Input label="Breed" value={editForm.breed || ""} onChange={setE("breed")} variant="bordered" radius="lg" required classNames={{ label: "font-semibold" }} />
                  <Input type="number" label="Age" value={editForm.age || ""} onChange={setE("age")} variant="bordered" radius="lg" required classNames={{ label: "font-semibold" }} />
                  <Input type="number" label="Fee ($)" value={editForm.adoptionFee ?? ""} onChange={setE("adoptionFee")} variant="bordered" radius="lg" required classNames={{ label: "font-semibold" }} />
                </div>
                <Input type="url" label="Image URL" value={editForm.image || ""} onChange={setE("image")} variant="bordered" radius="lg" required classNames={{ label: "font-semibold" }} />
                <Input label="Health Status" value={editForm.healthStatus || ""} onChange={setE("healthStatus")} variant="bordered" radius="lg" required classNames={{ label: "font-semibold" }} />
                <TextArea label="Description" value={editForm.description || ""} onChange={setE("description")} variant="bordered" radius="lg" minRows={3} required classNames={{ label: "font-semibold" }} />
              </div>
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700">
                <Button variant="flat" radius="lg" type="button" onPress={() => setIsEditModalOpen(false)} className="font-semibold">Cancel</Button>
                <Button type="submit" isLoading={editLoading} radius="lg" className="bg-gradient-to-r from-violet-600 to-pink-500 text-white font-bold shadow-md">
                  {!editLoading && "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Delete Modal ─── */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-lg mb-2">Confirm Delete</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Are you sure you want to delete the listing for{" "}
                <strong className="text-slate-900 dark:text-slate-100">{deletingPet?.name}</strong>?
                This action is permanent and will cancel all pending requests.
              </p>
            </div>
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700">
              <Button variant="flat" radius="lg" onPress={() => setIsDeleteModalOpen(false)} className="font-semibold">Cancel</Button>
              <Button color="danger" radius="lg" isLoading={deleteLoading} onPress={handleDelete} className="font-bold">
                {!deleteLoading && "Delete Listing"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
