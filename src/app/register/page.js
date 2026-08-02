"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiImage, FiArrowRight } from "react-icons/fi";
import { FaPaw } from "react-icons/fa";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (pass) => {
    if (pass.length < 6) return "Password must be at least 6 characters long.";
    if (!/[A-Z]/.test(pass)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(pass)) return "Password must contain at least one lowercase letter.";
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, photoURL, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const passError = validatePassword(password);
    if (passError) {
      toast.error(passError);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await signUp.email({
        email,
        password,
        name,
        image: photoURL || "",
      });

      if (res?.error) {
        toast.error(res.error.message || "Registration failed.");
      } else {
        toast.success("Account created successfully! Welcome to PawfectMatch.");
        router.push("/");
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 relative">
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg glass-card p-8 rounded-3xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "var(--accent-gradient)" }}>
            <FaPaw className="text-2xl text-white" />
          </div>
          <h2 className="text-3xl font-extrabold" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
            Join PawfectMatch
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Create an account to adopt pets or list animals for adoption.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="form-label">Full Name *</label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-3.5" style={{ color: "var(--text-muted)" }} size={18} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="form-input pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Email Address *</label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-3.5" style={{ color: "var(--text-muted)" }} size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="form-input pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Photo URL (Optional)</label>
            <div className="relative">
              <FiImage className="absolute left-3.5 top-3.5" style={{ color: "var(--text-muted)" }} size={18} />
              <input
                type="url"
                name="photoURL"
                value={formData.photoURL}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className="form-input pl-10"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Password *</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-3.5" style={{ color: "var(--text-muted)" }} size={18} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 chars (1 upper, 1 lower)"
                className="form-input pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Confirm Password *</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-3.5" style={{ color: "var(--text-muted)" }} size={18} />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="form-input pl-10"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-base mt-2 no-underline flex items-center justify-center gap-2"
          >
            {loading ? "Registering..." : <>Create Account <FiArrowRight /></>}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-sm mt-8" style={{ color: "var(--text-secondary)" }}>
          Already have an account?{" "}
          <Link href="/login" className="font-bold underline" style={{ color: "var(--accent)" }}>
            Log in here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
