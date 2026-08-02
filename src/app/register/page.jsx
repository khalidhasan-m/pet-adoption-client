"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FiUser, FiMail, FiLock, FiImage, FiEye, FiEyeOff } from "react-icons/fi";
import { FaPaw } from "react-icons/fa";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const set = (field) => (val) => setFormData((prev) => ({ ...prev, [field]: val }));

  const validate = () => {
    const { name, email, password, confirmPassword } = formData;
    if (!name || !email || !password || !confirmPassword)
      return "Please fill in all required fields.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) return toast.error(error);

    setLoading(true);
    try {
      const res = await signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        image: formData.photoURL || "",
      });

      if (res?.error) {
        toast.error(res.error.message || "Registration failed.");
      } else {
        toast.success("Account created! Welcome to PawfectMatch 🐾");
        router.push("/");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-14 px-4 relative bg-slate-50/50 dark:bg-slate-950 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-violet-500/10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-pink-500 text-white flex items-center justify-center mx-auto mb-4 shadow-xl shadow-violet-500/30 transform hover:rotate-6 transition-transform">
            <FaPaw className="text-3xl" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Join PawfectMatch
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Create an account to adopt pets or list animals for adoption.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            label="Full Name *"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => set("name")(e.target.value)}
            startContent={<FiUser className="text-slate-400" size={18} />}
            required
          />

          <Input
            type="email"
            label="Email Address *"
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) => set("email")(e.target.value)}
            startContent={<FiMail className="text-slate-400" size={18} />}
            required
          />

          <Input
            type="url"
            label="Photo URL (Optional)"
            placeholder="https://example.com/avatar.jpg"
            value={formData.photoURL}
            onChange={(e) => set("photoURL")(e.target.value)}
            startContent={<FiImage className="text-slate-400" size={18} />}
          />

          <Input
            type={showPassword ? "text" : "password"}
            label="Password *"
            placeholder="Min 6 chars, 1 uppercase, 1 lowercase"
            value={formData.password}
            onChange={(e) => set("password")(e.target.value)}
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

          <Input
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm Password *"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={(e) => set("confirmPassword")(e.target.value)}
            startContent={<FiLock className="text-slate-400" size={18} />}
            endContent={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors p-1"
                tabIndex={-1}
              >
                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
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
            className="w-full py-4 text-base font-bold rounded-xl mt-4"
          >
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-violet-600 dark:text-violet-400 hover:underline"
          >
            Log in here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
