"use client";

import { motion } from "framer-motion";
import React from "react";
import Image from "next/image";

const sections = [
  {
    title: "About Us",
    content: "Discover the electrifying world of Greek nightlife—right in the heart of North London."
  },
  {
    title: "Our Vibe",
    content: "We are the ultimate Greek party destination, capturing the spirit of bouzoukia and modern dance floors alike."
  },
  {
    title: "Authentic Greek Performances",
    content: "Top-tier singers from Greece bring the soul of Athens and Thessaloniki straight to our stage."
  },
  {
    title: "Live DJs & Non-Stop Dancing",
    content: "Our DJs blend Greek, European, and global hits, igniting the dancefloor till dawn."
  },
  {
    title: "Drinks, Flowers & Bouzoukia",
    content: "Premium drinks, flower throwing, and a celebration of Greek tradition come together for unforgettable nights."
  },
  {
    title: "Why North London?",
    content: "With a strong Greek and Cypriot community, North London is the ideal home for our events."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-tl from-zinc-800 to-zinc-950 text-amber-50  font-sans">
      <div className="relative h-[60vh] w-full overflow-hidden">
        <Image
          src="/singer.jpg"
          alt="Greek Party in North London"
          fill
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center p-4">
          <motion.h1
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-md"
          >
            Greek Nights in London
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="text-lg max-w-xl drop-shadow"
          >
            Live singers, DJs, drinks, flowers, and a whole lot of bouzoukia—every night is a memory.
          </motion.p>
        </div>
      </div>

      <div className="px-6 py-16 max-w-4xl mx-auto space-y-16">
        {sections.map((section, i) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-amber-200 mb-2">{section.title}</h3>
            <p className="text-base leading-relaxed">{section.content}</p>
          </motion.section>
        ))}

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-semibold text-amber-200 mb-2">What Makes Us Special</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Live Greek singers at every event</li>
            <li>Top-tier DJs spinning Greek & global hits</li>
            <li>Professional audio-visual experience</li>
            <li>Flower throwing tradition kept alive</li>
            <li>Exclusive drinks and bottle service</li>
            <li>Warm, friendly, multicultural crowd</li>
          </ul>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-semibold text-primary mb-4">Gallery</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {["stage.jpg", "tables.jpg", "bar.jpg"].map((img, idx) => (
              <Image
                key={idx}
                src={`/${img}`}
                alt={`Gallery ${idx + 1}`}
                width={400}
                height={250}
                className="rounded-lg object-cover border-2 border-amber-400"
              />
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-semibold   text-center text-indigo-600 mb-4">What People Say</h3>
          <div className="space-y-6">
            {["Eleni K.", "Andreas M.", "Sarah L."].map((name, idx) => (
              <blockquote key={name} className=" p-4 border-l-4 border-primary  bg-indigo-100 rounded-2xl">
                <p className="text-xl text-zinc-900 italic">
                  {["Honestly the best night I’ve had in London. I felt like I was back in Athens!",
                    "The music, the crowd, the energy... unforgettable. Already booked the next event.",
                    "Even as a non-Greek, I felt completely welcome. Amazing vibe!",][idx]}
                </p>
                <footer className="mt-2 text-sm text-muted-foreground">— {name}</footer>
              </blockquote>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-semibold text-indigo-600 mb-4 text-center">Contact Us</h3>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">Name</label>
              <input id="name" name="name" type="text" required className="mt-1 block w-full border border-border rounded px-3 py-2 bg-background text-foreground" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">Email</label>
              <input id="email" name="email" type="email" required className="mt-1 block w-full border border-border rounded px-3 py-2 bg-background text-foreground" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-muted-foreground">Message</label>
              <textarea id="message" name="message" rows={4} required className="mt-1 block w-full border border-border rounded px-3 py-2 bg-background text-foreground"></textarea>
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-800 text-white px-6 py-2 rounded ">Send Message</button>
          </form>
        </motion.section>

        <motion.section
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-2xl text-amber-200  ">Opa! We’ll see you at the next party 🎉</p>
        </motion.section>
      </div>
    </div>
  );
}
