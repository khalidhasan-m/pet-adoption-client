"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyRequests, cancelRequest } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import Modal from "@/components/Modal";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiEye, FiTrash2, FiCalendar, FiClock, FiHeart, FiX } from "react-icons/fi";
import { FaPaw } from "react-icons/fa";

export default function MyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cancel confirmation state
  const [cancelingReq, setCancelingReq] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await getMyRequests();
      if (res.success) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
      toast.error("Failed to load your adoption requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCancelConfirm = async () => {
    if (!cancelingReq) return;
    try {
      const res = await cancelRequest(cancelingReq._id);
      if (res.success) {
        toast.success("Adoption request canceled.");
        setModalOpen(false);
        setCancelingReq(null);
        fetchRequests();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to cancel request.");
    }
  };

  if (loading) {
    return <LoadingSpinner text="Fetching your requests..." />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
          My Adoption Requests
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Track the status of your adoption applications or cancel pending requests.
        </p>
      </div>

      {requests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((req) => (
            <motion.div
              key={req._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-2xl flex flex-col justify-between"
              style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
            >
              <div>
                <div className="flex gap-4 mb-4">
                  <img
                    src={req.petImage}
                    alt={req.petName}
                    className="w-20 h-20 rounded-xl object-cover border flex-shrink-0"
                    style={{ borderColor: "var(--border)" }}
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80";
                    }}
                  />
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-bold truncate" style={{ color: "var(--text-primary)" }}>
                        {req.petName}
                      </h3>
                      <span className={`badge badge-${req.status}`}>{req.status}</span>
                    </div>

                    <div className="mt-2 space-y-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                      <p className="flex items-center gap-1.5">
                        <FiClock style={{ color: "var(--text-muted)" }} />
                        Requested: {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                      <p className="flex items-center gap-1.5 font-semibold" style={{ color: "var(--accent)" }}>
                        <FiCalendar />
                        Pickup Date: {new Date(req.pickupDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {req.message && (
                  <p className="text-xs italic p-3 rounded-xl mb-4" style={{ background: "var(--bg-primary)", color: "var(--text-secondary)" }}>
                    "{req.message}"
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                <Link
                  href={`/pets/${req.petId}`}
                  className="btn-secondary btn-sm flex items-center gap-1.5 no-underline"
                >
                  <FiEye /> View Pet
                </Link>

                {req.status === "pending" && (
                  <button
                    onClick={() => {
                      setCancelingReq(req);
                      setModalOpen(true);
                    }}
                    className="btn-danger btn-sm flex items-center gap-1.5"
                  >
                    <FiTrash2 /> Cancel Request
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 glass-card rounded-3xl">
          <FiHeart className="mx-auto text-5xl mb-4" style={{ color: "var(--text-muted)" }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            No Requests Found
          </h3>
          <p className="text-sm max-w-sm mx-auto mb-6" style={{ color: "var(--text-secondary)" }}>
            You haven't submitted any adoption requests yet. Find a pet and apply!
          </p>
          <Link href="/pets" className="btn-primary no-underline">
            Browse Pets For Adoption
          </Link>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Cancel Request"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Are you sure you want to cancel your adoption request for{" "}
            <strong style={{ color: "var(--text-primary)" }}>{cancelingReq?.petName}</strong>?
          </p>

          <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
            <button onClick={() => setModalOpen(false)} className="btn-secondary">
              Keep Request
            </button>
            <button onClick={handleCancelConfirm} className="btn-danger">
              Cancel Request
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
