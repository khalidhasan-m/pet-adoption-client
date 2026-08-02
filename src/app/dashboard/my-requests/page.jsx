"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyRequests, cancelRequest } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Chip } from "@heroui/react";
import { Button } from "@/components/ui/Button";
import { FiEye, FiTrash2, FiCalendar, FiClock, FiHeart } from "react-icons/fi";
import { FaPaw } from "react-icons/fa";

const statusColor = { pending: "warning", approved: "success", rejected: "danger", cancelled: "default" };

export default function MyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  
  const [cancelingReq, setCancelingReq] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await getMyRequests();
      if (res.success) setRequests(res.data);
    } catch { toast.error("Failed to load your adoption requests."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRequests(); }, []);

  const openCancelModal = (req) => { setCancelingReq(req); setIsCancelModalOpen(true); };
  const closeCancelModal = () => { setCancelingReq(null); setIsCancelModalOpen(false); };

  const handleCancelConfirm = async () => {
    if (!cancelingReq) return; setCancelLoading(true);
    try {
      const res = await cancelRequest(cancelingReq._id);
      if (res.success) { toast.success("Adoption request cancelled."); closeCancelModal(); fetchRequests(); }
    } catch (err) { toast.error(err?.response?.data?.message || "Failed to cancel request."); }
    finally { setCancelLoading(false); }
  };

  if (loading) return <LoadingSpinner text="Fetching your requests..." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">My Adoption Requests</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track your application statuses or cancel pending requests.</p>
      </div>

      {requests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence>
            {requests.map((req) => (
              <motion.div key={req._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">

                <div>
                  <div className="flex gap-4 mb-4">
                    <img src={req.petImage} alt={req.petName}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-800 flex-shrink-0"
                      onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80"; }} />
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">{req.petName}</h3>
                        <Chip size="sm" color={statusColor[req.status] || "default"} variant="flat" className="capitalize font-semibold text-xs">{req.status}</Chip>
                      </div>

                      <div className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <p className="flex items-center gap-1.5">
                          <FiClock size={11} /> Requested: {new Date(req.createdAt).toLocaleDateString()}
                        </p>
                        <p className="flex items-center gap-1.5 font-semibold text-violet-600 dark:text-violet-400">
                          <FiCalendar size={11} /> Pickup: {new Date(req.pickupDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {req.message && (
                    <p className="text-xs italic text-slate-400 dark:text-slate-500 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 mb-4">
                      "{req.message}"
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button as={Link} href={`/pets/${req.petId}`} size="sm" variant="flat" radius="md"
                    startContent={<FiEye size={13} />} className="font-semibold text-xs">
                    View Pet
                  </Button>

                  {req.status === "pending" && (
                    <Button size="sm" color="danger" variant="flat" radius="md"
                      onPress={() => openCancelModal(req)} startContent={<FiTrash2 size={13} />}
                      className="font-semibold text-xs">
                      Cancel
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
          <FiHeart className="mx-auto text-5xl mb-4 text-slate-300 dark:text-slate-600" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No Requests Found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
            You haven't submitted any adoption requests yet. Find a pet and apply!
          </p>
          <Button as={Link} href="/pets" radius="lg"
            className="bg-gradient-to-r from-violet-600 to-pink-500 text-white font-bold shadow-md"
            startContent={<FaPaw />}>
            Browse Pets For Adoption
          </Button>
        </div>
      )}

      {/* ─── Cancel Confirmation Modal ────────────────────────────── */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-lg mb-2">Cancel Request?</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Are you sure you want to cancel your adoption request for{" "}
                <strong className="text-slate-900 dark:text-slate-100">{cancelingReq?.petName}</strong>?
              </p>
            </div>
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700">
              <Button variant="flat" radius="lg" onPress={closeCancelModal} className="font-semibold">Keep Request</Button>
              <Button color="danger" radius="lg" isLoading={cancelLoading} onPress={handleCancelConfirm} className="font-bold">
                {!cancelLoading && "Cancel Request"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
