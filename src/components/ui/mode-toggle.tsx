"use client";

import { motion } from "framer-motion";
import { useModeStore } from "@/store/mode";

export function ModeToggle() {
  const { mode, toggleMode } = useModeStore();
  const isRecruiter = mode === "recruiter";

  return (
    <button
      onClick={toggleMode}
      className="relative flex items-center rounded-full border border-white/10 bg-black/30 backdrop-blur-md overflow-hidden"
      aria-label={`Switch to ${isRecruiter ? "Yusuf" : "Recruiter"} mode`}
    >
      <span
        className={`relative z-10 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.15em] transition-colors duration-300 ${
          !isRecruiter ? "text-white" : "text-white/30"
        }`}
      >
        Yusuf
      </span>
      <span
        className={`relative z-10 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.15em] transition-colors duration-300 ${
          isRecruiter ? "text-white" : "text-white/30"
        }`}
      >
        Recruiter
      </span>
      <motion.div
        className="absolute top-0.5 bottom-0.5 rounded-full bg-white/10"
        initial={false}
        animate={{
          left: isRecruiter ? "50%" : "2px",
          right: isRecruiter ? "2px" : "50%",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
      />
    </button>
  );
}
