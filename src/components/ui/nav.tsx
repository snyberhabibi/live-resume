"use client";

import { ModeToggle } from "./mode-toggle";
import { useScrollStore } from "@/store/scroll";
import { chapterOrder } from "@/lib/colors";
import { motion } from "framer-motion";

const chapterLabels: Record<string, string> = {
  hero: "",
  origin: "Origin",
  builder: "Builder",
  corporate: "Corporate",
  convergence: "Convergence",
  culture: "Culture",
  contact: "Contact",
};

export function Nav() {
  const chapter = useScrollStore((s) => s.chapter);
  const progress = useScrollStore((s) => s.progress);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 sm:px-8">
      <div className="flex items-center gap-3">
        <span className="font-display text-sm font-medium text-white/80 tracking-wide">
          YR
        </span>
        {chapter !== "hero" && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30"
          >
            / {chapterLabels[chapter]}
          </motion.span>
        )}
      </div>

      <ModeToggle />

      {/* Scroll progress bar */}
      <div className="fixed bottom-0 left-0 right-0 h-[2px] z-50">
        <motion.div
          className="h-full bg-white/20"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </nav>
  );
}
