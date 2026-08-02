import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Pets ───────────────────────────────────────────────

export const getPets = (params = {}) =>
  api.get("/api/pets", { params }).then((res) => res.data);

export const getFeaturedPets = () =>
  api.get("/api/pets/featured").then((res) => res.data);

export const getPetById = (id) =>
  api.get(`/api/pets/${id}`).then((res) => res.data);

export const getMyListings = () =>
  api.get("/api/pets/my-listings").then((res) => res.data);

export const createPet = (data) =>
  api.post("/api/pets", data).then((res) => res.data);

export const updatePet = (id, data) =>
  api.put(`/api/pets/${id}`, data).then((res) => res.data);

export const deletePet = (id) =>
  api.delete(`/api/pets/${id}`).then((res) => res.data);

// ─── Adoption Requests ──────────────────────────────────

export const submitAdoptionRequest = (data) =>
  api.post("/api/adoptions", data).then((res) => res.data);

export const getMyRequests = () =>
  api.get("/api/adoptions/my-requests").then((res) => res.data);

export const getPetRequests = (petId) =>
  api.get(`/api/adoptions/pet/${petId}`).then((res) => res.data);

export const approveRequest = (id) =>
  api.patch(`/api/adoptions/${id}/approve`).then((res) => res.data);

export const rejectRequest = (id) =>
  api.patch(`/api/adoptions/${id}/reject`).then((res) => res.data);

export const cancelRequest = (id) =>
  api.delete(`/api/adoptions/${id}`).then((res) => res.data);

export default api;
