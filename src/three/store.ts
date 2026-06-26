// ───────────────────────────────────────────────────────────────────────────
//  Global scroll/scene store.
//  React-driving fields (chapter, ready, quality) trigger re-renders sparingly.
//  High-frequency fields (progress, pointer, velocity) are read TRANSIENTLY via
//  getState() inside useFrame - never subscribed - so the canvas never re-renders.
// ───────────────────────────────────────────────────────────────────────────
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { CHAPTER_COUNT, type QualityTier } from "./config";

interface SceneState {
  // continuous (transient)
  progress: number; // 0..1 across the whole journey
  chapterProgress: number; // 0..1 within the active chapter
  velocity: number; // scroll speed, smoothed (0..~1)
  pointer: { x: number; y: number }; // NDC -1..1
  pointerActive: boolean;

  // discrete (React)
  chapter: number; // 0..CHAPTER_COUNT-1
  ready: boolean;
  quality: QualityTier;
  reducedMotion: boolean;
  soundOn: boolean;
  theme: "dark" | "light";

  // internals for velocity calc
  _lastProgress: number;
  _lastT: number;

  setProgress: (p: number) => void;
  setPointer: (x: number, y: number, active: boolean) => void;
  setReady: (r: boolean) => void;
  setQuality: (q: QualityTier) => void;
  setReducedMotion: (r: boolean) => void;
  toggleSound: () => void;
  toggleTheme: () => void;
}

export const useScene = create<SceneState>()(
  subscribeWithSelector((set, get) => ({
    progress: 0,
    chapterProgress: 0,
    velocity: 0,
    pointer: { x: 0, y: 0 },
    pointerActive: false,
    chapter: 0,
    ready: false,
    quality: "high",
    reducedMotion: false,
    soundOn: false,
    theme: "light",
    _lastProgress: 0,
    _lastT: typeof performance !== "undefined" ? performance.now() : 0,

    setProgress: (p) => {
      const s = get();
      const now = typeof performance !== "undefined" ? performance.now() : 0;
      const dt = Math.max(1, now - s._lastT) / 1000;
      const rawVel = Math.abs(p - s._lastProgress) / dt; // per second
      // smooth the velocity so chroma/turbulence reactions feel liquid
      const velocity = s.velocity + (Math.min(rawVel * 4, 1) - s.velocity) * 0.15;

      const scaled = p * (CHAPTER_COUNT - 1);
      const chapter = Math.max(0, Math.min(CHAPTER_COUNT - 1, Math.round(scaled)));
      const chapterProgress = scaled - Math.floor(scaled);

      set({
        progress: p,
        velocity,
        chapterProgress,
        _lastProgress: p,
        _lastT: now,
        ...(chapter !== s.chapter ? { chapter } : null),
      });
    },

    setPointer: (x, y, active) => set({ pointer: { x, y }, pointerActive: active }),
    setReady: (r) => set({ ready: r }),
    setQuality: (q) => set({ quality: q }),
    setReducedMotion: (r) => set({ reducedMotion: r }),
    toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
    toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
  })),
);
