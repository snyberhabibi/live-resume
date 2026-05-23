import { create } from "zustand";
import { chapterOrder } from "@/lib/colors";

interface ScrollState {
  /** 0–1 overall scroll progress */
  progress: number;
  /** Current chapter index */
  chapterIndex: number;
  /** 0–1 progress within current chapter */
  chapterProgress: number;
  /** Current chapter key */
  chapter: (typeof chapterOrder)[number];
  setProgress: (p: number) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  chapterIndex: 0,
  chapterProgress: 0,
  chapter: "hero",
  setProgress: (p) => {
    const clamped = Math.max(0, Math.min(1, p));
    const count = chapterOrder.length;
    const scaled = clamped * count;
    const idx = Math.min(Math.floor(scaled), count - 1);
    const cp = scaled - idx;
    set({
      progress: clamped,
      chapterIndex: idx,
      chapterProgress: cp,
      chapter: chapterOrder[idx],
    });
  },
}));
