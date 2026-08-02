"use client";

import Link from "next/link";
import { FaPaw } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t" style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}>
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 no-underline mb-4">
              <div className="p-2 rounded-xl" style={{ background: "var(--accent-gradient)" }}>
                <FaPaw className="text-white text-lg" />
              </div>
              <span className="text-lg font-bold" style={{
                fontFamily: "var(--font-heading)",
                background: "var(--accent-gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                PawfectMatch
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>
              Connecting loving families with adorable pets. Every pet deserves a forever home, and we are here to make that happen.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <FaFacebook />, href: "#" },
                { icon: <FaTwitter />, href: "#" },
                { icon: <FaInstagram />, href: "#" },
                { icon: <FaYoutube />, href: "#" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all text-sm"
                  style={{
                    background: "var(--bg-tertiary)",
                    color: "var(--text-secondary)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "var(--accent)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "var(--bg-tertiary)";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
              Quick Links
            </h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "All Pets", href: "/pets" },
                { label: "Add a Pet", href: "/dashboard/add-pet" },
                { label: "My Requests", href: "/dashboard/my-requests" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm no-underline transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
              Resources
            </h4>
            <div className="flex flex-col gap-2.5">
              {["Pet Care Guide", "Adoption Process", "Volunteer", "Donate", "FAQ"].map((item) => (
                <span key={item} className="text-sm cursor-pointer transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
              Contact Us
            </h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <FiMapPin size={16} className="mt-0.5 flex-shrink-0" style={{ color: "var(--accent)" }} />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  123 Pet Avenue, Dhaka 1200, Bangladesh
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone size={16} className="flex-shrink-0" style={{ color: "var(--accent)" }} />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>+880 1234-567890</span>
              </div>
              <div className="flex items-center gap-3">
                <FiMail size={16} className="flex-shrink-0" style={{ color: "var(--accent)" }} />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>hello@pawfectmatch.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t py-5" style={{ borderColor: "var(--border)" }}>
        <div className="container text-center">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            &copy; {currentYear} PawfectMatch. All rights reserved. Made with ❤️ for pets.
          </p>
        </div>
      </div>
    </footer>
  );
}
