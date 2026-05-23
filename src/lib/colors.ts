export interface ChapterPalette {
  sky: string;
  fog: string;
  sand: string;
  accent: string;
  text: string;
  textMuted: string;
  glow: string;
}

export const chapters: Record<string, ChapterPalette> = {
  hero: {
    sky: "#1a1a2e",
    fog: "#16213e",
    sand: "#c2956b",
    accent: "#7ec8e3",
    text: "#f0e6d3",
    textMuted: "rgba(240, 230, 211, 0.5)",
    glow: "#7ec8e3",
  },
  origin: {
    sky: "#1a0f00",
    fog: "#2d1a00",
    sand: "#d4a76a",
    accent: "#e8a838",
    text: "#f5e6d0",
    textMuted: "rgba(245, 230, 208, 0.5)",
    glow: "#e8a838",
  },
  builder: {
    sky: "#1a1209",
    fog: "#2d1f0e",
    sand: "#c9a067",
    accent: "#d4763c",
    text: "#f0e0cc",
    textMuted: "rgba(240, 224, 204, 0.5)",
    glow: "#d4763c",
  },
  corporate: {
    sky: "#0a0e1a",
    fog: "#111827",
    sand: "#8b8fa3",
    accent: "#64748b",
    text: "#e2e8f0",
    textMuted: "rgba(226, 232, 240, 0.4)",
    glow: "#475569",
  },
  convergence: {
    sky: "#0a1a12",
    fog: "#0f2518",
    sand: "#a8c49a",
    accent: "#4ade80",
    text: "#e8f5e0",
    textMuted: "rgba(232, 245, 224, 0.5)",
    glow: "#4ade80",
  },
  culture: {
    sky: "#1a0a0a",
    fog: "#2d1212",
    sand: "#d4a076",
    accent: "#e63946",
    text: "#fce4e4",
    textMuted: "rgba(252, 228, 228, 0.5)",
    glow: "#e63946",
  },
  contact: {
    sky: "#0f172a",
    fog: "#1e293b",
    sand: "#b8c4d4",
    accent: "#7ec8e3",
    text: "#f1f5f9",
    textMuted: "rgba(241, 245, 249, 0.5)",
    glow: "#7ec8e3",
  },
};

export const chapterOrder = [
  "hero",
  "origin",
  "builder",
  "corporate",
  "convergence",
  "culture",
  "contact",
] as const;

export type ChapterKey = (typeof chapterOrder)[number];

export function lerpColor(a: string, b: string, t: number): string {
  const parse = (hex: string) => {
    const h = hex.replace("#", "");
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  };
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const b_ = Math.round(ab + (bb - ab) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b_.toString(16).padStart(2, "0")}`;
}
