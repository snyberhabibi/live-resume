"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useModeStore } from "@/store/mode";
import { bio } from "@/data/resume";

export function Hero() {
  const mode = useModeStore((s) => s.mode);
  const isRecruiter = mode === "recruiter";

  return (
    <section className="relative flex min-h-screen items-center justify-center px-6">
      <div className="relative z-10 max-w-2xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-white/40"
        >
          {bio.location}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-2 text-5xl font-bold tracking-tight text-white sm:text-7xl"
        >
          {bio.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 text-lg text-white/50"
        >
          {bio.title}
        </motion.p>

        <AnimatePresence mode="wait">
          <motion.p
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`text-xl font-medium ${
              isRecruiter ? "text-indigo-300" : "text-cyan-300"
            }`}
          >
            {isRecruiter ? bio.recruiterTagline : bio.builderTagline}
          </motion.p>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <a
            href="#skills"
            className={`rounded-full px-6 py-2.5 text-sm font-medium text-white transition-colors ${
              isRecruiter
                ? "bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30"
                : "bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30"
            }`}
          >
            Explore
          </a>
          <a
            href={`mailto:${bio.email}`}
            className="rounded-full border border-white/10 px-6 py-2.5 text-sm font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white"
          >
            Get in touch
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="h-8 w-5 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
        >
          <div className="h-1.5 w-1 rounded-full bg-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
