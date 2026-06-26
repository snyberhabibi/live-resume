"use client";

import { motion } from "framer-motion";
import { useScene } from "@/three/store";
import { NAV_LABELS } from "@/content/chapters";
import { CHAPTER_ACCENT, CHAPTER_ACCENT_LIGHT } from "@/three/config";
import { SPRING, SPRING_SNAPPY } from "./Reveal";

export function Nav() {
  const chapter = useScene((s) => s.chapter);
  const theme = useScene((s) => s.theme);
  const toggleTheme = useScene((s) => s.toggleTheme);
  const accents = theme === "light" ? CHAPTER_ACCENT_LIGHT : CHAPTER_ACCENT;
  const inactiveDot = theme === "light" ? "rgba(20,28,40,0.4)" : "rgba(255,255,255,0.3)";
  return (
    <>
      <motion.nav
        className="fixed inset-x-0 top-0 z-[90] flex items-center justify-between px-5 py-4 mix-blend-difference sm:px-8 sm:py-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...SPRING, delay: 3.2 }}
      >
        <div className="flex items-center gap-4">
          <span className="font-display text-sm tracking-wide text-white">YR</span>
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="rounded text-white/70 transition-colors hover:text-white focus-visible:mix-blend-normal"
          >
            {theme === "dark" ? (
              // sun
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              // moon
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            )}
          </button>
        </div>
        <motion.span
          key={chapter}
          className="font-mono text-[8px] uppercase tracking-[0.4em] text-white/55 sm:text-[9px]"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING_SNAPPY}
        >
          {NAV_LABELS[chapter]}
        </motion.span>
      </motion.nav>

      <motion.div
        className="fixed right-5 top-1/2 z-[90] hidden -translate-y-1/2 flex-col gap-3 lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...SPRING, delay: 3.4 }}
      >
        {NAV_LABELS.map((label, i) => (
          <button
            key={i}
            aria-label={`Go to ${label}`}
            onClick={() => window.dispatchEvent(new CustomEvent("lr:goto", { detail: i }))}
            className="group flex h-4 w-4 items-center justify-center"
          >
            <span
              className="h-1.5 w-1.5 rounded-full transition-all duration-500 group-hover:scale-150"
              style={{
                background: i === chapter ? accents[i] : inactiveDot,
                transform: i === chapter ? "scale(1.6)" : "scale(1)",
                boxShadow: i === chapter ? `0 0 10px ${accents[i]}` : "none",
              }}
            />
          </button>
        ))}
      </motion.div>
    </>
  );
}
