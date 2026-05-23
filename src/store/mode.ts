import { create } from "zustand";

export type Mode = "recruiter" | "yusuf";

interface ModeState {
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
}

export const useModeStore = create<ModeState>((set) => ({
  mode: "yusuf",
  setMode: (mode) => set({ mode }),
  toggleMode: () =>
    set((s) => ({ mode: s.mode === "recruiter" ? "yusuf" : "recruiter" })),
}));
