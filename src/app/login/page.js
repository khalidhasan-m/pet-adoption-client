"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { FaGoogle, FaPaw } from "react-icons/fa";
import LoadingSpinner from "@/components/LoadingSpinner";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await signIn.email({
        email,
        password,
      });

      if (res?.error) {
        toast.error(res.error.message || "Failed to log in. Check your credentials.");
      } else {
        toast.success("Welcome back! Login successful.");
        router.push(redirectUrl);
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: redirectUrl,
      });
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Failed to sign in with Google.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md glass-card p-8 rounded-3xl relative z-10"
    >
      <div className="text-center mb-8">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "var(--accent-gradient)" }}
        >
          <FaPaw className="text-2xl text-white" />
        </div>
        <h2
          className="text-3xl font-extrabold"
          style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}
        >
          Welcome Back
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Log in to manage pet listings and adoption requests.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleEmailLogin} className="space-y-5">
        <div>
          <label className="form-label">Email Address</label>
          <div className="relative">
            <FiMail className="absolute left-3.5 top-3.5" style={{ color: "var(--text-muted)" }} size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="form-input pl-10"
              required
            />
          </div>
        </div>

        <div>
          <label className="form-label">Password</label>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-3.5" style={{ color: "var(--text-muted)" }} size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input pl-10"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3.5 text-base no-underline flex items-center justify-center gap-2"
        >
          {loading ? "Logging in..." : <>Log In <FiArrowRight /></>}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-grow border-t" style={{ borderColor: "var(--border)" }} />
        <span className="px-3 text-xs uppercase" style={{ color: "var(--text-muted)" }}>OR</span>
        <div className="flex-grow border-t" style={{ borderColor: "var(--border)" }} />
      </div>

      {/* Google Login */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="btn-secondary w-full py-3 flex items-center justify-center gap-3 text-sm font-semibold"
      >
        <FaGoogle className="text-red-500" /> Continue with Google
      </button>

      {/* Register link */}
      <p className="text-center text-sm mt-8" style={{ color: "var(--text-secondary)" }}>
        Don't have an account?{" "}
        <Link href="/register" className="font-bold underline" style={{ color: "var(--accent)" }}>
          Register here
        </Link>
      </p>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 relative">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <Suspense fallback={<LoadingSpinner text="Loading login page..." />}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
