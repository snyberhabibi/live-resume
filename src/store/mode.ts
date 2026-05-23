import { create } from "zustand";

export type Mode = "recruiter" | "builder";

interface ModeState {
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
}

export const useModeStore = create<ModeState>((set) => ({
  mode: "builder",
  setMode: (mode) => set({ mode }),
  toggleMode: () =>
    set((state) => ({
      mode: state.mode === "recruiter" ? "builder" : "recruiter",
    })),
}));
