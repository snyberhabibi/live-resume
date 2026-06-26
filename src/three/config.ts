// ───────────────────────────────────────────────────────────────────────────
//  DAYLIGHT / BLUEPRINT - global art-direction + tuning constants.
//  One file governs the whole world: palette, quality tiers, camera path,
//  per-section atmosphere. Light theme is PRIMARY (a clean architectural
//  blueprint); the dark "drafting-table" theme is a toggle. Everything
//  downstream reads from here.
//
//  Through-line: COMPLEXITY → CLARITY. Each section, the dust arrives as
//  turbulent chaos and resolves into one clean, simple form.
// ───────────────────────────────────────────────────────────────────────────

export type QualityTier = "low" | "med" | "high" | "ultra";

// Particle simulation grid edge per tier → particleCount = SIZE².
//   ultra 1024² ≈ 1.05M   high 640² ≈ 410k   med 448² ≈ 200k   low 256² ≈ 65k
export const SIM_SIZE: Record<QualityTier, number> = {
  ultra: 768, // ~590k
  high: 512, // ~262k
  med: 384, // ~147k
  low: 224, // ~50k
};

export const DPR_CAP: Record<QualityTier, [number, number]> = {
  ultra: [1, 2],
  high: [1, 1.75],
  med: [1, 1.5],
  low: [1, 1.25],
};

// Effects toggles per tier - degrade gracefully on weak GPUs / mobile.
export const FX: Record<
  QualityTier,
  { dof: boolean; chroma: boolean; grain: boolean; bloomMips: boolean; godrays: boolean }
> = {
  ultra: { dof: true, chroma: true, grain: true, bloomMips: true, godrays: true },
  high: { dof: true, chroma: true, grain: true, bloomMips: true, godrays: true },
  med: { dof: false, chroma: true, grain: true, bloomMips: true, godrays: false },
  low: { dof: false, chroma: false, grain: false, bloomMips: false, godrays: false },
};

// Foreground dust-mote count per tier (atmospheric depth layer).
export const MOTES: Record<QualityTier, number> = {
  ultra: 2200,
  high: 1400,
  med: 800,
  low: 350,
};

// ─── Dark "drafting-table" theme (secondary; the toggle) ─────────────────────
// Particles render additively as warm graphite embers over a near-black void.
export const PALETTE = {
  obsidian: "#070809", // the void
  ink: "#0c0e12",
  ash: "#3a4452", // coolest particle state (settled graphite)
  ember: "#5b86c4", // mid-temperature (cool blueprint blue)
  gold: "#e8eefb", // hot core (dissolving → bright)
  white: "#f2f5fb",
};

// ─── Light "daylight / blueprint" theme (PRIMARY) ────────────────────────────
// Cool architectural paper + slate ink + a confident blueprint accent. Particles
// render as deep ink with normal blending - drafting lines on a clean sheet.
export const LIGHT = {
  bg: "#eef0f3",
  skyTop: "#eef1f5",
  skyHorizon: "#dde3ea",
  terrainBase: "#dfe3e8",
  terrainContour: "#46566a",
  terrainFog: "#eef0f3",
  ink: "#28303a", // particles & motes (deep slate ink)
  accent: "#3d5a80", // default blueprint accent
  formBase: "#c3c8d0",
  formLight: "#ffffff",
  formEdge: "#3d5a80",
};

// ─── Per-section visuals. Order: person first, then proof. ───────────────────
//   0 hero       identity (field cycles one glyph per "hat")
//   1 about      who I am (particles cleared, photos lead)
//   2 howiwork   strengths + growth (arrow)
//   3 approach   the philosophy (funnel)
//   4 experience the career towers
//   5 record     the rising graph (never below 100%)
//   6 toolbelt   the lattice cube
//   7 contact    the hub (let's connect)

// Light theme - restrained, professional; mostly cool slate/teal with warm
// accents on the human beats.
export const CHAPTER_ACCENT_LIGHT: string[] = [
  "#3d5a80", // 0 hero       - slate blue
  "#9c6450", // 1 about      - warm terracotta (the human)
  "#2f6f8e", // 2 how I work - trust teal-blue
  "#2f7d7a", // 3 approach   - teal (clarity)
  "#44567f", // 4 experience - indigo slate
  "#2f8f5f", // 5 record     - emerald (every number in the green)
  "#4a6076", // 6 toolbelt   - steel blue
  "#1f9d55", // 7 contact    - go-green (the checkmark)
];

// Dark theme accents - cooler, luminous (drive bloom/godrays).
export const CHAPTER_ACCENT: string[] = [
  "#7fa8e8", // 0 hero
  "#e0a07a", // 1 about - warm amber (the human)
  "#6fb8d8", // 2 how I work - trust teal-blue
  "#4fd0c0", // 3 approach - cyan clarity
  "#9fb6cc", // 4 experience - cold steel
  "#57c98a", // 5 record - emerald (every number in the green)
  "#a6b0f0", // 6 toolbelt - indigo
  "#34c759", // 7 contact - iOS go-green (the checkmark)
];

// ─── Sky top/horizon per section ─────────────────────────────────────────────
export const CHAPTER_SKY_LIGHT: { top: string; horizon: string }[] = [
  { top: "#eef1f5", horizon: "#dde3ea" }, // 0 hero
  { top: "#f4efe9", horizon: "#e8d8c8" }, // 1 about - faint warm
  { top: "#eef2f4", horizon: "#d8e6e8" }, // 2 how I work - faint teal
  { top: "#ecf2f2", horizon: "#d6e3e2" }, // 3 approach - faint teal
  { top: "#edeef4", horizon: "#d9dce8" }, // 4 experience - faint indigo
  { top: "#f3f0ea", horizon: "#e7ddca" }, // 5 record - faint warm
  { top: "#eef0f5", horizon: "#dadfe9" }, // 6 toolbelt - faint steel
  { top: "#edf0f6", horizon: "#d8e0ee" }, // 7 contact - faint blue
];

export const CHAPTER_SKY: { top: string; horizon: string }[] = [
  { top: "#05060c", horizon: "#1b233a" }, // 0 hero
  { top: "#0a0710", horizon: "#2a1a12" }, // 1 about - warm
  { top: "#05090c", horizon: "#0e2630" }, // 2 how I work - teal
  { top: "#04080c", horizon: "#103030" }, // 3 approach
  { top: "#070a12", horizon: "#16202c" }, // 4 experience
  { top: "#0a0810", horizon: "#2a1e10" }, // 5 record - warm horizon
  { top: "#06070e", horizon: "#181830" }, // 6 toolbelt
  { top: "#06060e", horizon: "#1c2c46" }, // 7 contact
];

// ─── Camera keyframes (one per section). Damped between on scroll. ───────────
export interface CamKey {
  pos: [number, number, number];
  target: [number, number, number];
  fov: number;
}
export const CAM_KEYS: CamKey[] = [
  { pos: [0, 9.5, 48], target: [0, 9.5, 0], fov: 42 }, // 0 hero - glyph sits in the lower-middle, clear of the title above
  { pos: [9, 6.2, 34], target: [5, 6, 0], fov: 48 }, // 1 about - constellation, off to the side
  { pos: [8, 8.5, 46], target: [2, 8, 0], fov: 48 }, // 2 how I work - the arrow
  { pos: [-7, 7, 27], target: [0, 7, 0], fov: 46 }, // 3 approach - the funnel
  { pos: [7, 9.5, 50], target: [6, 8, 0], fov: 50 }, // 4 experience - the towers
  { pos: [0, 6.5, 29], target: [0, 6.5, 0], fov: 40 }, // 5 record - the rising graph
  { pos: [-11, 7.5, 31], target: [0, 6.5, 0], fov: 50 }, // 6 toolbelt - the lattice cube
  { pos: [0, 6, 30], target: [0, 6, 0], fov: 42 }, // 7 contact - the hub
];

// Portrait/phone framing - each shape re-centred + pulled back to fit a narrow screen.
export const CAM_KEYS_MOBILE: CamKey[] = [
  { pos: [0, 6.8, 58], target: [0, 6.8, 0], fov: 52 }, // 0 hero - glyph pulled back + low, clears title above and line below
  { pos: [5, 6.0, 44], target: [5, 6.0, 0], fov: 54 }, // 1 about
  { pos: [2, 7.5, 48], target: [2, 7.5, 0], fov: 54 }, // 2 how I work
  { pos: [0, 7.0, 40], target: [0, 7.0, 0], fov: 56 }, // 3 approach
  { pos: [7, 8.0, 60], target: [7, 8.0, 0], fov: 54 }, // 4 experience
  { pos: [0, 6.5, 42], target: [0, 6.5, 0], fov: 52 }, // 5 record
  { pos: [0, 6.4, 40], target: [0, 6.4, 0], fov: 56 }, // 6 toolbelt
  { pos: [0, 6.0, 38], target: [0, 6.0, 0], fov: 50 }, // 7 contact
];

export const CHAPTER_COUNT = CAM_KEYS.length;

// Sections where the particle graphic should fade away to a clean background
// (so dense, text-heavy content isn't fighting a distracting dot field).
//   1 = about (personal beat)   2 = how I work (strengths + growth read clean)
export const MINIMAL_GRAPHIC_SECTIONS = new Set<number>([1, 2]);

// Morph timing.
export const MORPH_DURATION = 1.25; // seconds for a dissolve→reform (snappy)
export const MONUMENT_RADIUS = 9; // governs all morph-target scales
export const TERRAIN_Y = -9;
