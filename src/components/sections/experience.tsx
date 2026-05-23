"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useModeStore } from "@/store/mode";
import { experience } from "@/data/resume";

export function Experience() {
  const mode = useModeStore((s) => s.mode);
  const isRecruiter = mode === "recruiter";

  return (
    <section id="experience" className="relative z-10 px-6 py-32">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 text-3xl font-bold text-white"
        >
          Experience
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-12 text-sm text-white/40"
        >
          {isRecruiter
            ? "Professional track record and impact"
            : "Where I've been building"}
        </motion.p>

        <div className="space-y-8">
          {experience.map((exp, i) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm transition-colors hover:border-white/10"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {exp.role}
                  </h3>
                  <p className="text-sm text-white/50">{exp.company}</p>
                </div>
                <span className="text-xs text-white/30">{exp.period}</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={mode}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="mb-4 text-sm leading-relaxed text-white/50"
                >
                  {isRecruiter ? exp.recruiterSummary : exp.builderSummary}
                </motion.p>
              </AnimatePresence>

              <div className="flex flex-wrap gap-2">
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                      isRecruiter
                        ? "bg-indigo-500/10 text-indigo-300"
                        : "bg-cyan-500/10 text-cyan-300"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
