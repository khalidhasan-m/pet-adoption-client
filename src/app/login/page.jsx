"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FaGoogle, FaPaw } from "react-icons/fa";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill in all fields.");
    setLoading(true);
    try {
      const res = await signIn.email({ email, password });
      if (res?.error) {
        toast.error(res.error.message || "Invalid credentials.");
      } else {
        toast.success("Welcome back! 🐾");
        router.push(redirectUrl);
      }
    } catch {
      toast.error("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const fullCallbackUrl = new URL(
        redirectUrl,
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      ).toString();

      await signIn.social({
        provider: "google",
        callbackURL: fullCallbackUrl,
      });
    } catch {
      toast.error("Failed to sign in with Google.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative z-10 w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-violet-500/10"
    >
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-pink-500 text-white flex items-center justify-center mx-auto mb-4 shadow-xl shadow-violet-500/30 transform hover:rotate-6 transition-transform">
          <FaPaw className="text-3xl" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Log in to manage pet listings and adoption requests.
        </p>
      </div>

      {/* Email / Password Form */}
      <form onSubmit={handleEmailLogin} className="space-y-5">
        <Input
          type="email"
          label="Email Address"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          startContent={<FiMail className="text-slate-400" size={18} />}
          required
        />

        <Input
          type={showPassword ? "text" : "password"}
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          startContent={<FiLock className="text-slate-400" size={18} />}
          endContent={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors p-1"
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          }
          required
        />

        <Button
          type="submit"
          isLoading={loading}
          isDisabled={loading}
          variant="primary"
          size="lg"
          className="w-full py-4 text-base font-bold rounded-xl mt-2"
        >
          Log In
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-7">
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-2">
          Or continue with
        </span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* Google Login */}
      <Button
        type="button"
        onClick={handleGoogleLogin}
        isLoading={googleLoading}
        variant="outline"
        size="lg"
        className="w-full py-3.5 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-xl"
        startContent={!googleLoading && <FaGoogle className="text-red-500 text-lg" />}
      >
        Continue with Google
      </Button>

      {/* Footer */}
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="font-bold text-violet-600 dark:text-violet-400 hover:underline"
        >
          Register here
        </Link>
      </p>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-14 px-4 relative bg-slate-50/50 dark:bg-slate-950 overflow-hidden">
      {/* Glowing background shapes */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

      <Suspense fallback={<div className="text-slate-400 text-sm">Loading…</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
