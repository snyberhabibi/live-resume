"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useScene } from "@/three/store";
import { setSoundEnabled, chapterSwell, uiTick } from "@/lib/audio";

export function SoundToggle() {
  const soundOn = useScene((s) => s.soundOn);
  const toggle = useScene((s) => s.toggleSound);

  // keep the engine in sync with the toggle
  useEffect(() => {
    setSoundEnabled(soundOn);
  }, [soundOn]);

  // a soft swell on each chapter change + subtle ticks on hovering interactive
  // elements (both no-op while muted)
  useEffect(() => {
    const unsub = useScene.subscribe(
      (s) => s.chapter,
      () => chapterSwell(),
    );
    let last: Element | null = null;
    const onOver = (e: PointerEvent) => {
      const el = (e.target as HTMLElement)?.closest?.("a, button") ?? null;
      if (el && el !== last) {
        last = el;
        uiTick(740);
      } else if (!el) {
        last = null;
      }
    };
    document.addEventListener("pointerover", onOver);
    return () => {
      unsub();
      document.removeEventListener("pointerover", onOver);
    };
  }, []);

  return (
    <motion.button
      onClick={() => {
        toggle();
        uiTick(660);
      }}
      aria-label={soundOn ? "Mute sound" : "Enable sound"}
      aria-pressed={soundOn}
      className="fixed bottom-5 left-5 z-[95] flex items-center gap-2.5 rounded mix-blend-difference focus-visible:mix-blend-normal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.4, duration: 0.8 }}
    >
      <span className="flex h-3 items-end gap-[2px]">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-[2px] bg-white"
            style={{ height: "30%" }}
            animate={soundOn ? { height: ["30%", "100%", "40%"] } : { height: "30%" }}
            transition={
              soundOn
                ? { duration: 0.7 + i * 0.18, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
                : { duration: 0.3 }
            }
          />
        ))}
      </span>
      <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/60">
        {soundOn ? "Sound" : "Muted"}
      </span>
    </motion.button>
  );
}
