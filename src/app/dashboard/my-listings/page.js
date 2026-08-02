"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getMyListings,
  deletePet,
  updatePet,
  getPetRequests,
  approveRequest,
  rejectRequest,
} from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import Modal from "@/components/Modal";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FiEdit,
  FiTrash2,
  FiEye,
  FiInbox,
  FiCheckCircle,
  FiXCircle,
  FiPlusCircle,
  FiCalendar,
  FiUser,
  FiMail,
} from "react-icons/fi";
import { FaPaw } from "react-icons/fa";

const SPECIES_LIST = ["Dog", "Cat", "Bird", "Rabbit", "Fish", "Hamster", "Turtle", "Other"];

export default function MyListingsPage() {
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState({ totalListings: 0, available: 0, adopted: 0 });
  const [loading, setLoading] = useState(true);

  // Modal States
  const [requestsModalOpen, setRequestsModalOpen] = useState(false);
  const [activePetForRequests, setActivePetForRequests] = useState(null);
  const [petRequests, setPetRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingPet, setDeletingPet] = useState(null);

  const fetchListings = async () => {
    try {
      const res = await getMyListings();
      if (res.success) {
        setListings(res.data);
        setStats(res.stats);
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
      toast.error("Failed to load your pet listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // ─── Requests Modal Handler ──────────────────────────────
  const handleOpenRequestsModal = async (pet) => {
    setActivePetForRequests(pet);
    setRequestsModalOpen(true);
    setRequestsLoading(true);
    try {
      const res = await getPetRequests(pet._id);
      if (res.success) {
        setPetRequests(res.data);
      }
    } catch (err) {
      console.error("Error fetching pet requests:", err);
      toast.error("Failed to load requests for this pet.");
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      const res = await approveRequest(requestId);
      if (res.success) {
        toast.success(res.message || "Adoption request approved!");
        // Refresh requests and listings
        handleOpenRequestsModal(activePetForRequests);
        fetchListings();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to approve request.");
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const res = await rejectRequest(requestId);
      if (res.success) {
        toast.success("Request rejected.");
        handleOpenRequestsModal(activePetForRequests);
        fetchListings();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reject request.");
    }
  };

  // ─── Edit Modal Handler ──────────────────────────────────
  const handleOpenEditModal = (pet) => {
    setEditingPet(pet);
    setEditFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      gender: pet.gender,
      image: pet.image,
      healthStatus: pet.healthStatus,
      vaccinationStatus: pet.vaccinationStatus,
      location: pet.location,
      adoptionFee: pet.adoptionFee,
      description: pet.description,
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updatePet(editingPet._id, editFormData);
      if (res.success) {
        toast.success(res.message || "Pet updated successfully!");
        setEditModalOpen(false);
        fetchListings();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update pet.");
    }
  };

  // ─── Delete Modal Handler ────────────────────────────────
  const handleConfirmDelete = async () => {
    if (!deletingPet) return;
    try {
      const res = await deletePet(deletingPet._id);
      if (res.success) {
        toast.success("Pet listing deleted successfully!");
        setDeleteModalOpen(false);
        setDeletingPet(null);
        fetchListings();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete pet.");
    }
  };

  if (loading) {
    return <LoadingSpinner text="Fetching your listings..." />;
  }

  return (
    <div className="space-y-8">
      {/* Title & Stats */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
              My Pet Listings
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Manage your pet posts, review adoption requests, or update details.
            </p>
          </div>
          <Link href="/dashboard/add-pet" className="btn-primary no-underline">
            <FiPlusCircle /> Post New Pet
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{ background: "var(--accent-gradient)" }}>
              <FaPaw className="text-xl" />
            </div>
            <div>
              <span className="text-2xl font-black block" style={{ color: "var(--text-primary)" }}>{stats.totalListings}</span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>Total Listings</span>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-emerald-500 bg-emerald-500/10">
              <FiCheckCircle className="text-xl" />
            </div>
            <div>
              <span className="text-2xl font-black block" style={{ color: "var(--text-primary)" }}>{stats.available}</span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>Available for Adoption</span>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-purple-500 bg-purple-500/10">
              <FiHeart className="text-xl" />
            </div>
            <div>
              <span className="text-2xl font-black block" style={{ color: "var(--text-primary)" }}>{stats.adopted}</span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>Successfully Adopted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {listings.map((pet) => (
            <motion.div
              key={pet._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-5 rounded-2xl flex flex-col justify-between"
              style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
            >
              <div className="flex gap-4 mb-4">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-24 h-24 rounded-xl object-cover border flex-shrink-0"
                  style={{ borderColor: "var(--border)" }}
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80";
                  }}
                />
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-bold truncate" style={{ color: "var(--text-primary)" }}>
                      {pet.name}
                    </h3>
                    <span className={`badge ${pet.status === "adopted" ? "badge-adopted" : "badge-available"}`}>
                      {pet.status}
                    </span>
                  </div>

                  <p className="text-xs font-semibold mt-1" style={{ color: "var(--accent)" }}>
                    {pet.species} • {pet.breed}
                  </p>

                  <div className="mt-2 text-xs font-bold" style={{ color: "var(--text-primary)" }}>
                    Fee: {pet.adoptionFee === 0 ? "Free" : `$${pet.adoptionFee}`}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                <button
                  onClick={() => handleOpenRequestsModal(pet)}
                  className="btn-secondary btn-sm flex items-center justify-center gap-1.5 text-xs py-2"
                >
                  <FiInbox /> Requests
                </button>

                <Link
                  href={`/pets/${pet._id}`}
                  className="btn-secondary btn-sm flex items-center justify-center gap-1.5 text-xs py-2 no-underline"
                >
                  <FiEye /> View
                </Link>

                <button
                  onClick={() => handleOpenEditModal(pet)}
                  className="btn-secondary btn-sm flex items-center justify-center gap-1.5 text-xs py-2"
                >
                  <FiEdit /> Edit
                </button>

                <button
                  onClick={() => {
                    setDeletingPet(pet);
                    setDeleteModalOpen(true);
                  }}
                  className="btn-danger btn-sm flex items-center justify-center gap-1.5 text-xs py-2"
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 glass-card rounded-3xl">
          <FaPaw className="mx-auto text-5xl mb-4" style={{ color: "var(--text-muted)" }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            No Pet Listings Yet
          </h3>
          <p className="text-sm max-w-sm mx-auto mb-6" style={{ color: "var(--text-secondary)" }}>
            You haven't posted any pets for adoption yet. Start by creating your first listing!
          </p>
          <Link href="/dashboard/add-pet" className="btn-primary no-underline">
            Post First Pet Listing
          </Link>
        </div>
      )}

      {/* ─── Requests Modal ─────────────────────────────────────── */}
      <Modal
        isOpen={requestsModalOpen}
        onClose={() => setRequestsModalOpen(false)}
        title={`Adoption Requests for ${activePetForRequests?.name || ""}`}
        maxWidth="max-w-2xl"
      >
        {requestsLoading ? (
          <LoadingSpinner text="Fetching applications..." />
        ) : petRequests.length > 0 ? (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {petRequests.map((req) => (
              <div
                key={req._id}
                className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                style={{ background: "var(--bg-primary)", borderColor: "var(--border)" }}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                      {req.userName}
                    </span>
                    <span className={`badge badge-${req.status}`}>{req.status}</span>
                  </div>

                  <p className="text-xs flex items-center gap-1" style={{ color: "var(--text-secondary)" }}>
                    <FiMail size={12} /> {req.userEmail}
                  </p>

                  <p className="text-xs flex items-center gap-1" style={{ color: "var(--text-secondary)" }}>
                    <FiCalendar size={12} /> Pickup Date: {new Date(req.pickupDate).toLocaleDateString()}
                  </p>

                  {req.message && (
                    <p className="text-xs italic pt-1 text-gray-500 dark:text-gray-400">
                      "{req.message}"
                    </p>
                  )}
                </div>

                {/* Approve/Reject Buttons only if pending */}
                {req.status === "pending" && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleApproveRequest(req._id)}
                      className="btn-success btn-sm flex items-center gap-1"
                    >
                      <FiCheckCircle /> Approve
                    </button>
                    <button
                      onClick={() => handleRejectRequest(req._id)}
                      className="btn-danger btn-sm flex items-center gap-1"
                    >
                      <FiXCircle /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FiInbox className="mx-auto text-4xl mb-2" style={{ color: "var(--text-muted)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              No adoption requests received for this pet yet.
            </p>
          </div>
        )}
      </Modal>

      {/* ─── Edit Pet Modal ─────────────────────────────────────── */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Update Listing: ${editingPet?.name || ""}`}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Pet Name</label>
              <input
                type="text"
                value={editFormData.name || ""}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label">Species</label>
              <select
                value={editFormData.species || "Dog"}
                onChange={(e) => setEditFormData({ ...editFormData, species: e.target.value })}
                className="form-select"
                required
              >
                {SPECIES_LIST.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="form-label">Breed</label>
              <input
                type="text"
                value={editFormData.breed || ""}
                onChange={(e) => setEditFormData({ ...editFormData, breed: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label">Age</label>
              <input
                type="number"
                value={editFormData.age || ""}
                onChange={(e) => setEditFormData({ ...editFormData, age: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label">Fee ($)</label>
              <input
                type="number"
                value={editFormData.adoptionFee ?? ""}
                onChange={(e) => setEditFormData({ ...editFormData, adoptionFee: e.target.value })}
                className="form-input"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Image URL</label>
            <input
              type="url"
              value={editFormData.image || ""}
              onChange={(e) => setEditFormData({ ...editFormData, image: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Health Status</label>
            <input
              type="text"
              value={editFormData.healthStatus || ""}
              onChange={(e) => setEditFormData({ ...editFormData, healthStatus: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              value={editFormData.description || ""}
              onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
              className="form-textarea"
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── Delete Confirmation Modal ──────────────────────────── */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete Listing"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Are you sure you want to delete the listing for{" "}
            <strong style={{ color: "var(--text-primary)" }}>{deletingPet?.name}</strong>? This action cannot be undone and will cancel all pending adoption requests.
          </p>

          <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button onClick={handleConfirmDelete} className="btn-danger">
              Delete Listing
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
