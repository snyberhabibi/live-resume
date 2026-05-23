"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useModeStore } from "@/store/mode";
import { skills } from "@/data/resume";

const categoryLabels: Record<string, string> = {
  engineering: "Engineering",
  ai: "AI & ML",
  product: "Product",
  ops: "Operations",
  leadership: "Leadership",
};

const categoryColors: Record<string, { bar: string; bg: string; text: string }> = {
  engineering: {
    bar: "bg-cyan-400",
    bg: "bg-cyan-400/10",
    text: "text-cyan-300",
  },
  ai: {
    bar: "bg-violet-400",
    bg: "bg-violet-400/10",
    text: "text-violet-300",
  },
  product: {
    bar: "bg-pink-400",
    bg: "bg-pink-400/10",
    text: "text-pink-300",
  },
  ops: {
    bar: "bg-emerald-400",
    bg: "bg-emerald-400/10",
    text: "text-emerald-300",
  },
  leadership: {
    bar: "bg-amber-400",
    bg: "bg-amber-400/10",
    text: "text-amber-300",
  },
};

export function Skills() {
  const mode = useModeStore((s) => s.mode);
  const isRecruiter = mode === "recruiter";

  // Group by category
  const grouped = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, typeof skills>
  );

  return (
    <section id="skills" className="relative z-10 px-6 py-32">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 text-3xl font-bold text-white"
        >
          Skills
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-12 text-sm text-white/40"
        >
          {isRecruiter
            ? "Core competencies and business impact areas"
            : "What I actually work with day to day"}
        </motion.p>

        <div className="grid gap-10 sm:grid-cols-2">
          {Object.entries(grouped).map(([category, items], gi) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: gi * 0.1 }}
            >
              <h3
                className={`mb-4 text-xs font-semibold uppercase tracking-[0.2em] ${categoryColors[category].text}`}
              >
                {categoryLabels[category]}
              </h3>
              <div className="space-y-4">
                {items.map((skill) => (
                  <div key={skill.name}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-sm font-medium text-white/80">
                        {skill.name}
                      </span>
                      <span className="text-xs text-white/30">
                        {Math.round(skill.level * 100)}%
                      </span>
                    </div>
                    <div
                      className={`h-1.5 rounded-full ${categoryColors[category].bg}`}
                    >
                      <motion.div
                        className={`h-full rounded-full ${categoryColors[category].bar}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level * 100}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1,
                          delay: 0.2,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={mode}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mt-1 text-xs text-white/30"
                      >
                        {isRecruiter
                          ? skill.recruiterNote
                          : skill.builderNote}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
