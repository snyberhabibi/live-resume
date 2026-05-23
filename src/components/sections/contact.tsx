"use client";

import { motion } from "framer-motion";
import { useModeStore } from "@/store/mode";
import { bio } from "@/data/resume";

export function Contact() {
  const mode = useModeStore((s) => s.mode);
  const isRecruiter = mode === "recruiter";

  return (
    <section id="contact" className="relative z-10 px-6 py-32">
      <div className="mx-auto max-w-xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 text-3xl font-bold text-white"
        >
          {isRecruiter ? "Let's Connect" : "Let's Build"}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-8 text-sm text-white/40"
        >
          {isRecruiter
            ? "Open to discussing opportunities where AI meets product."
            : "Always down to jam on agent systems, 3D web, or weird side projects."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <a
            href={`mailto:${bio.email}`}
            className={`rounded-full px-8 py-3 text-sm font-medium text-white transition-colors ${
              isRecruiter
                ? "bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30"
                : "bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30"
            }`}
          >
            {bio.email}
          </a>
          <a
            href={`https://github.com/${bio.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/10 px-8 py-3 text-sm font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white"
          >
            GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}
