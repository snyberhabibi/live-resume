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
  ultra: 1024,
  high: 640,
  med: 448,
  low: 256,
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
  ultra: 4000,
  high: 2600,
  med: 1500,
  low: 700,
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

// ─── Per-section accent ──────────────────────────────────────────────────────
//   0 hero        identity - the seed forms
//   1 approach    the philosophy: complexity → a single clean line
//   2 experience  the career columns rise (JPMorgan · Cisco · HashiCorp · IBM)
//   3 impact      shards become a vase - quota, never below 100%
//   4 toolbelt    scattered tools snap into an ordered lattice
//   5 contact     a clean ring - let's connect

// Light theme - restrained, professional; mostly cool slate/teal with one warm
// "achievement" moment on the impact section.
export const CHAPTER_ACCENT_LIGHT: string[] = [
  "#3d5a80", // 0 hero      - slate blue
  "#2f7d7a", // 1 approach  - teal (clarity)
  "#44567f", // 2 experience- indigo slate
  "#b07d2b", // 3 impact    - bronze/gold (the 100% mark)
  "#4a6076", // 4 toolbelt  - steel blue
  "#9c6450", // 5 about     - warm terracotta (the human)
  "#355f9e", // 6 contact   - confident blue
];

// Dark theme accents - cooler, luminous (drive bloom/godrays).
export const CHAPTER_ACCENT: string[] = [
  "#7fa8e8", // 0 hero
  "#4fd0c0", // 1 approach - cyan clarity
  "#9fb6cc", // 2 experience - cold steel
  "#f4b14a", // 3 impact - warm gold (achievement)
  "#a6b0f0", // 4 toolbelt - indigo
  "#e0a07a", // 5 about - warm amber (the human)
  "#8fc0ff", // 6 contact - sky blue
];

// ─── Sky top/horizon per section ─────────────────────────────────────────────
// Light: very subtle paper variations - the mood shifts without ever leaving
// "clean studio daylight". Dark: moody drafting-room gradients.
export const CHAPTER_SKY_LIGHT: { top: string; horizon: string }[] = [
  { top: "#eef1f5", horizon: "#dde3ea" }, // hero
  { top: "#ecf2f2", horizon: "#d6e3e2" }, // approach - faint teal
  { top: "#edeef4", horizon: "#d9dce8" }, // experience - faint indigo
  { top: "#f3f0ea", horizon: "#e7ddca" }, // impact - faint warm
  { top: "#eef0f5", horizon: "#dadfe9" }, // toolbelt - faint steel
  { top: "#f4efe9", horizon: "#e8d8c8" }, // about - faint warm
  { top: "#edf0f6", horizon: "#d8e0ee" }, // contact - faint blue
];

export const CHAPTER_SKY: { top: string; horizon: string }[] = [
  { top: "#05060c", horizon: "#1b233a" }, // hero
  { top: "#04080c", horizon: "#103030" }, // approach
  { top: "#070a12", horizon: "#16202c" }, // experience
  { top: "#0a0810", horizon: "#2a1e10" }, // impact - warm horizon
  { top: "#06070e", horizon: "#181830" }, // toolbelt
  { top: "#0a0710", horizon: "#2a1a12" }, // about - warm
  { top: "#06060e", horizon: "#1c2c46" }, // contact
];

// ─── Camera keyframes (one per section). Damped between on scroll. ───────────
// Framed for the new abstract forms; consistent target heights keep the damping
// between sections smooth.
export interface CamKey {
  pos: [number, number, number];
  target: [number, number, number];
  fov: number;
}
export const CAM_KEYS: CamKey[] = [
  { pos: [0, 4.2, 30], target: [0, 4.2, 0], fov: 42 }, // 0 hero - face the icosahedron
  { pos: [-7, 7, 27], target: [0, 7, 0], fov: 46 }, // 1 approach - the converging funnel
  { pos: [7, 9.5, 50], target: [6, 8, 0], fov: 50 }, // 2 experience - towers, right of the cards
  { pos: [0, 6.5, 29], target: [0, 6.5, 0], fov: 40 }, // 3 impact - the rising graph
  { pos: [-11, 7.5, 31], target: [0, 6.5, 0], fov: 50 }, // 4 toolbelt - orbit the lattice cube
  { pos: [9, 6.2, 34], target: [5, 6, 0], fov: 48 }, // 5 about - constellation, right of the photos
  { pos: [0, 6, 30], target: [0, 6, 0], fov: 42 }, // 6 contact - face the hub
];

// Portrait/phone framing - each shape is re-centred and pulled back to sit
// nicely on a narrow screen. (The desktop right-bias + aspect-dolly blow-up
// shoved shapes off-frame and shrank them to faint traces on mobile.)
export const CAM_KEYS_MOBILE: CamKey[] = [
  { pos: [0, 4.6, 36], target: [0, 4.6, 0], fov: 56 }, // 0 hero
  { pos: [0, 7.0, 40], target: [0, 7.0, 0], fov: 56 }, // 1 approach
  { pos: [7, 8.0, 60], target: [7, 8.0, 0], fov: 54 }, // 2 experience
  { pos: [0, 6.5, 42], target: [0, 6.5, 0], fov: 52 }, // 3 record
  { pos: [0, 6.4, 40], target: [0, 6.4, 0], fov: 56 }, // 4 toolbelt
  { pos: [5, 6.0, 44], target: [5, 6.0, 0], fov: 54 }, // 5 about
  { pos: [0, 6.0, 38], target: [0, 6.0, 0], fov: 50 }, // 6 contact
];

export const CHAPTER_COUNT = CAM_KEYS.length;

// Morph timing.
export const MORPH_DURATION = 1.7; // seconds for a dissolve→reform
export const MONUMENT_RADIUS = 9; // governs all morph-target scales
export const TERRAIN_Y = -9;
