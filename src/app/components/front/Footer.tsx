"use client";
import Image from "next/image";
import { FaTiktok } from "react-icons/fa";


import Link from "next/link";
import { Instagram, Facebook, Phone, Mail, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-100 pt-14 pb-10 border-t border-[#262626] font-sans">
      <div className="container mx-auto px-6 md:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-sm">
        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
            <Image
              src="/allgreekfever_logo.png"
              alt="All Greek Fever Logo"
              width={50}
              height={50}
              className="rounded"
            />
          <h3 className="text-lg font-semibold text-amber-100 mb-4">Our Vision</h3>
          <p className="text-zinc-100  leading-relaxed">
            We craft refined digital experiences blending design, technology, and strategy — tailored for modern events and businesses.
          </p>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-amber-100 mb-4">Explore</h3>
          <ul className="space-y-3 text-zinc-100 hover:text-zinc-300">
            {[
              { href: "/", label: "Home" },
              { href: "/services", label: "Services" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white transition font-medium">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Contact & Social */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-amber-100 mb-4">Connect</h3>
          <ul className="space-y-2 text-zinc-100">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 " />
              <Link href="mailto:info@yourdomain.com" className="hover:text-indigo-300 transition">
                <strong>Email:</strong> k2kevent@gmail.com
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-white" />
              <Link href="tel:+447771894852" className="hover:text-indigo-300 transition">
                <strong>Call:</strong> +44 7771 894852
              </Link>
            </li>
            <li className="text-zinc-100 mt-2">London, UK</li>
          </ul>

          <div className="flex gap-5 mt-5">
            <Link href="https://www.instagram.com/allgreek_fever/" target="_blank" className="hover:text-pink-500 transition">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="https://www.facebook.com/share/16sZD4TNPY/?mibextid=wwXIfr" target="_blank" className="hover:text-blue-600 transition">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="https://www.tiktok.com/@allgreek_fever?_t=ZM-8xCiFF9MphG&_r=1" target="_blank" className="hover:text-fuchsia-700 transition">
              <FaTiktok className="w-5 h-5" />
            </Link>
            <Link href="https://wa.me/+447771894852" target="_blank" className="hover:text-green-500 transition">
              <MessageSquare className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="mt-12 text-center text-xs text-[#666] tracking-wide px-4">
        © {new Date().getFullYear()} <span className="font-semibold text-white">All Greek Fever</span>. All rights reserved.
      </div>
    </footer>
  );
}
