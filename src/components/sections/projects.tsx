"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useModeStore } from "@/store/mode";
import { projects } from "@/data/resume";

export function Projects() {
  const mode = useModeStore((s) => s.mode);
  const isRecruiter = mode === "recruiter";

  return (
    <section id="projects" className="relative z-10 px-6 py-32">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 text-3xl font-bold text-white"
        >
          Projects
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-12 text-sm text-white/40"
        >
          {isRecruiter
            ? "Key deliverables and their business outcomes"
            : "Things I've shipped"}
        </motion.p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm transition-colors hover:border-white/10"
            >
              <h3 className="mb-1 text-base font-semibold text-white">
                {project.name}
              </h3>
              <p className="mb-3 text-xs text-white/40">
                {project.description}
              </p>

              <AnimatePresence mode="wait">
                <motion.p
                  key={mode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 flex-1 text-xs leading-relaxed text-white/50"
                >
                  {isRecruiter
                    ? project.recruiterDetail
                    : project.builderDetail}
                </motion.p>
              </AnimatePresence>

              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-white/40"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-3 text-xs font-medium transition-colors ${
                    isRecruiter
                      ? "text-indigo-400 hover:text-indigo-300"
                      : "text-cyan-400 hover:text-cyan-300"
                  }`}
                >
                  View live &rarr;
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
