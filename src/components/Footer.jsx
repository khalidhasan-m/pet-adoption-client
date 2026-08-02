"use client";

import Link from "next/link";
import { FaPaw } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 no-underline">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 via-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/20">
                <FaPaw className="text-lg" />
              </div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent tracking-tight">
                PawfectMatch
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Connecting loving families with adorable pets. Every pet deserves a forever home, and we are here to make that happen.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: <FaFacebook />, href: "#" },
                { icon: <FaTwitter />, href: "#" },
                { icon: <FaInstagram />, href: "#" },
                { icon: <FaYoutube />, href: "#" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white transition-all flex items-center justify-center text-sm shadow-sm"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-4 tracking-tight">
              Quick Links
            </h4>
            <div className="flex flex-col space-y-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "All Pets", href: "/pets" },
                { label: "Add a Pet", href: "/dashboard/add-pet" },
                { label: "My Requests", href: "/dashboard/my-requests" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors no-underline font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-4 tracking-tight">
              Resources
            </h4>
            <div className="flex flex-col space-y-2.5">
              {["Pet Care Guide", "Adoption Process", "Volunteer", "Donate", "FAQ"].map((item) => (
                <span
                  key={item}
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-4 tracking-tight">
              Contact Us
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                <FiMapPin size={16} className="mt-1 text-purple-600 flex-shrink-0" />
                <span>123 Pet Avenue, Dhaka 1200, Bangladesh</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <FiPhone size={16} className="text-purple-600 flex-shrink-0" />
                <span>+880 1234-567890</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <FiMail size={16} className="text-purple-600 flex-shrink-0" />
                <span>hello@pawfectmatch.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-200/80 dark:border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            &copy; {currentYear} PawfectMatch. All rights reserved. Made with ❤️ for pets.
          </p>
        </div>
      </div>
    </footer>
  );
}
