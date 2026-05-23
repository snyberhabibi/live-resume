"use client";

import { motion } from "framer-motion";
import { useModeStore } from "@/store/mode";

export function ModeToggle() {
  const { mode, toggleMode } = useModeStore();
  const isRecruiter = mode === "recruiter";

  return (
    <button
      onClick={toggleMode}
      className="relative flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-2 py-1.5 backdrop-blur-xl transition-colors hover:border-white/20"
    >
      <span
        className={`z-10 px-3 py-1 text-xs font-medium transition-colors ${
          !isRecruiter ? "text-white" : "text-white/50"
        }`}
      >
        Builder
      </span>
      <span
        className={`z-10 px-3 py-1 text-xs font-medium transition-colors ${
          isRecruiter ? "text-white" : "text-white/50"
        }`}
      >
        Recruiter
      </span>
      <motion.div
        className="absolute top-1 bottom-1 rounded-full"
        initial={false}
        animate={{
          left: isRecruiter ? "50%" : "4px",
          right: isRecruiter ? "4px" : "50%",
          backgroundColor: isRecruiter
            ? "rgba(99, 102, 241, 0.3)"
            : "rgba(34, 211, 238, 0.3)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </button>
  );
}
