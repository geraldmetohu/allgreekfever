"use client";

import { motion } from "framer-motion";

interface HeroProps {
  backgroundImage: string;
  title: string;
  subtitle: string;
}

export default function Hero({ backgroundImage, title, subtitle }: HeroProps) {
  return (
    <section
      className="min-h-[70vh] md:h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
     <motion.div
  className="bg-black bg-opacity-20 p-6 md:p-10 rounded-2xl text-white text-center w-full max-w-3xl"
  initial={{ opacity: 0, x: -100 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 1 }}
>
  <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 leading-tight">{title}</h1>
  <p className="text-sm sm:text-base md:text-lg mb-6">{subtitle}</p>
  <a
    href="/plan"
    className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
  >
    Book your table
  </a>
</motion.div>

    </section>
  );
}
