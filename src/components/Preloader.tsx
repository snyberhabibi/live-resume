"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useScene } from "@/three/store";
import { Scramble } from "./Scramble";

const BOOT = [
  "> initializing yusuf.rahman",
  "> resolving experience ........ ok",
  "> compiling solutions ......... ok",
  "> clarity from complexity ..... ok",
];

export function Preloader() {
  const ready = useScene((s) => s.ready);
  const [minDone, setMinDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinDone(true), 1100);
    return () => clearTimeout(t);
  }, []);

  const done = ready && minDone;

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setGone(true), 800);
    return () => clearTimeout(t);
  }, [done]);

  if (gone) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg)] px-6"
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
    >
      <div className="w-full max-w-sm">
        <div className="space-y-1.5 font-mono text-[10px] text-[var(--fg)]/45 sm:text-[11px]">
          {BOOT.map((line, i) => (
            <div key={i}>
              <Scramble text={line} delay={0.2 + i * 0.35} charMs={11} />
            </div>
          ))}
        </div>
        <motion.div
          className="mt-7 font-display text-xl font-semibold tracking-tight text-[var(--fg)]/80"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.6 }}
        >
          Yusuf Rahman
        </motion.div>
        <motion.div
          className="mt-1 font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--fg)]/45"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.95, duration: 0.6 }}
        >
          Solutions Engineer
        </motion.div>
        <div className="mt-4 h-px w-full overflow-hidden bg-[var(--fg)]/10">
          <motion.div
            className="h-full bg-[var(--accent)]/75"
            initial={{ x: "-100%" }}
            animate={done ? { x: "0%" } : { x: ["-100%", "-15%", "-100%"] }}
            transition={
              done
                ? { duration: 0.6, ease: [0.32, 0.72, 0, 1] }
                : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
            }
          />
        </div>
      </div>
    </motion.div>
  );
}
