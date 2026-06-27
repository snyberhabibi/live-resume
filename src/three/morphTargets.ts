// ───────────────────────────────────────────────────────────────────────────
//  Morph targets - each section assembles into a clean WIREFRAME GRAPHIC built
//  from nodes + edges (the same drafting-table language as the toolbelt cube).
//  Between any two shapes the cloud blows apart into turbulent chaos and then
//  resolves into the next clean structure ("complexity → clarity").
//
//  Order is person-first (matches CHAPTERS / the config arrays):
//   0 hero       cycles through "many hats" glyphs - who Yusuf is
//   1 about      a constellation (FADED OUT)  - the personal beat stays clean
//   2 how I work an upward arrow (FADED OUT)  - text reads clean, no distraction
//   3 approach   one clean flowing line       - complexity resolved to simplicity
//   4 experience four ascending tower frames  - JPMorgan · Cisco · HashiCorp · IBM
//   5 record     a rising performance graph   - never below the 100% baseline
//   6 toolbelt   a 4×4×4 lattice cube         - the structured toolkit
//   7 contact    a green check in a rounded box - let's connect
//
//  RGBA-packed (xyz = position, w = 1) for a FloatType DataTexture, count = SIZE².
// ───────────────────────────────────────────────────────────────────────────
import { MONUMENT_RADIUS as R } from "./config";

const TAU = Math.PI * 2;

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function gauss(rng: () => number, sd = 1) {
  const u = Math.max(1e-6, rng());
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v) * sd;
}

type Vec3 = [number, number, number];
type Edge = [number, number];
type Graph = { nodes: Vec3[]; edges: Edge[] };
type Filler = (i: number, t: number, rng: () => number) => Vec3;

function build(count: number, seed: number, fn: Filler): Float32Array {
  const arr = new Float32Array(count * 4);
  const rng = mulberry32(seed);
  for (let i = 0; i < count; i++) {
    const [x, y, z] = fn(i, i / count, rng);
    const o = i * 4;
    arr[o] = x;
    arr[o + 1] = y;
    arr[o + 2] = z;
    arr[o + 3] = 1;
  }
  return arr;
}

// ─── shared wireframe filler - particles land in node clusters (bright joints)
//     or scattered along the edges between them (the structure lines) ─────────
function buildGraph(
  count: number,
  seed: number,
  g: Graph,
  opts: { nodeFrac?: number; nodeJitter?: number; edgeJitter?: number } = {},
): Float32Array {
  const nodeFrac = opts.nodeFrac ?? 0.3;
  const nodeJitter = opts.nodeJitter ?? 0.13;
  const edgeJitter = opts.edgeJitter ?? 0.05;
  const { nodes, edges } = g;
  const arr = new Float32Array(count * 4);
  const rng = mulberry32(seed);
  for (let i = 0; i < count; i++) {
    const o = i * 4;
    let x: number, y: number, z: number;
    if (edges.length === 0 || rng() < nodeFrac) {
      const n = nodes[(rng() * nodes.length) | 0];
      x = n[0] + gauss(rng, nodeJitter);
      y = n[1] + gauss(rng, nodeJitter);
      z = n[2] + gauss(rng, nodeJitter);
    } else {
      const [ai, bi] = edges[(rng() * edges.length) | 0];
      const a = nodes[ai];
      const b = nodes[bi];
      const f = rng();
      x = a[0] + (b[0] - a[0]) * f + gauss(rng, edgeJitter);
      y = a[1] + (b[1] - a[1]) * f + gauss(rng, edgeJitter);
      z = a[2] + (b[2] - a[2]) * f + gauss(rng, edgeJitter);
    }
    arr[o] = x;
    arr[o + 1] = y;
    arr[o + 2] = z;
    arr[o + 3] = 1;
  }
  return arr;
}

const dist3 = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

const HERO_Y = 4.6;

// ─── 3 - approach: ONE clean flowing line. "I make complex things simple" -
//     the tangle resolves into a single confident through-line, alive with a
//     gentle 3D undulation. ────────────────────────────────────────────────
function clarityLine(): Graph {
  const N = 80;
  const cy = 7.0;
  const nodes: Vec3[] = [];
  const edges: Edge[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const x = (t * 2 - 1) * R * 1.25;
    const y = cy + Math.sin(t * Math.PI) * 0.6; // a barely-there arc
    const z = Math.sin(t * Math.PI * 2.0) * 1.2; // gentle 3D flow for life
    nodes.push([x, y, z]);
    if (i > 0) {
      edges.push([i - 1, i]);
      edges.push([i - 1, i]); // weighted twice → a dense, solid line
    }
  }
  return { nodes, edges };
}
const CLARITY = clarityLine();

// ─── 2 - experience: four ascending wireframe towers (with floors) ───────────
function towers(): Graph {
  // shifted right of centre so they clear the left-aligned experience cards
  const defs = [
    { x: -R * 0.35, w: 2.3, d: 2.3, h: R * 0.95 }, // JPMorgan Chase
    { x: R * 0.4, w: 2.3, d: 2.3, h: R * 1.3 }, // Cisco - AppDynamics
    { x: R * 1.15, w: 2.3, d: 2.3, h: R * 1.7 }, // HashiCorp
    { x: R * 1.9, w: 2.5, d: 2.5, h: R * 2.05 }, // IBM (current, tallest)
  ];
  const nodes: Vec3[] = [];
  const edges: Edge[] = [];
  for (const c of defs) {
    const floors = Math.max(2, Math.round(c.h / 3.2));
    const hw = c.w / 2;
    const hd = c.d / 2;
    for (let k = 0; k <= floors; k++) {
      const y = (k / floors) * c.h + 0.15;
      const b = nodes.length;
      nodes.push([c.x - hw, y, -hd], [c.x + hw, y, -hd], [c.x + hw, y, hd], [c.x - hw, y, hd]);
      edges.push([b, b + 1], [b + 1, b + 2], [b + 2, b + 3], [b + 3, b]);
      if (k > 0) {
        const p = b - 4;
        for (let q = 0; q < 4; q++) edges.push([p + q, b + q]);
      }
    }
  }
  return { nodes, edges };
}
const TOWERS = towers();

// ─── 3 - impact: a rising performance graph above the 100% baseline ──────────
// One baseline (the "100%" floor), columns rising to each year's data point, and
// a bold trend line climbing up-and-to-the-right. The trend edges are weighted
// (pushed twice) so the climb reads as the dominant line, not the grid.
function performanceGraph(): Graph {
  const nodes: Vec3[] = [];
  const edges: Edge[] = [];
  const xL = -R * 1.0;
  const xR = R * 1.0;
  const baseY = 2.6; // the "100%" baseline (everything sits above it)
  const dataY = [4.6, 5.4, 6.6, 7.9, 9.4, 11.2]; // monotonic climb
  // single baseline
  const blA = nodes.length;
  nodes.push([xL, baseY, 0]);
  const blB = nodes.length;
  nodes.push([xR, baseY, 0]);
  edges.push([blA, blB]);
  // data points + vertical columns down to the baseline
  const N = dataY.length;
  const data: number[] = [];
  for (let i = 0; i < N; i++) {
    const x = xL + (xR - xL) * (i / (N - 1));
    const di = nodes.length;
    nodes.push([x, dataY[i], 0]);
    data.push(di);
    const dd = nodes.length;
    nodes.push([x, baseY, 0]);
    edges.push([di, dd]); // column to baseline
  }
  // the climb - weighted twice so it's the dominant line
  for (let i = 0; i < N - 1; i++) {
    edges.push([data[i], data[i + 1]]);
    edges.push([data[i], data[i + 1]]);
  }
  return { nodes, edges };
}
const GRAPH = performanceGraph();

// ─── 4 - toolbelt: the 4×4×4 lattice cube (the one you liked) ────────────────
const GRID = 4; // 4³ = 64 nodes
const GSP = R * 0.4; // node spacing
const LAT_CY = 6.4; // lattice center height
function latticeCoord(ix: number, iy: number, iz: number): Vec3 {
  const c = (GRID - 1) / 2;
  return [(ix - c) * GSP, LAT_CY + (iy - c) * GSP, (iz - c) * GSP];
}
function buildLattice(count: number, seed: number): Float32Array {
  const arr = new Float32Array(count * 4);
  const rng = mulberry32(seed);
  for (let i = 0; i < count; i++) {
    const o = i * 4;
    let x: number, y: number, z: number;
    if (rng() < 0.4) {
      const [nx, ny, nz] = latticeCoord(
        Math.floor(rng() * GRID),
        Math.floor(rng() * GRID),
        Math.floor(rng() * GRID),
      );
      x = nx + gauss(rng, 0.16);
      y = ny + gauss(rng, 0.16);
      z = nz + gauss(rng, 0.16);
    } else {
      const ix = Math.floor(rng() * GRID);
      const iy = Math.floor(rng() * GRID);
      const iz = Math.floor(rng() * GRID);
      const axis = Math.floor(rng() * 3);
      const a = latticeCoord(ix, iy, iz);
      const b = latticeCoord(
        axis === 0 ? Math.min(GRID - 1, ix + 1) : ix,
        axis === 1 ? Math.min(GRID - 1, iy + 1) : iy,
        axis === 2 ? Math.min(GRID - 1, iz + 1) : iz,
      );
      const f = rng();
      x = a[0] + (b[0] - a[0]) * f + gauss(rng, 0.05);
      y = a[1] + (b[1] - a[1]) * f + gauss(rng, 0.05);
      z = a[2] + (b[2] - a[2]) * f + gauss(rng, 0.05);
    }
    arr[o] = x;
    arr[o + 1] = y;
    arr[o + 2] = z;
    arr[o + 3] = 1;
  }
  return arr;
}

// ─── 1 - about: a loose constellation (community / people / connection) ──────
function constellation(): Graph {
  const rng = mulberry32(77);
  const N = 20;
  const cx = 5.0;
  const cy = 6.2;
  const nodes: Vec3[] = [];
  for (let i = 0; i < N; i++) {
    nodes.push([cx + gauss(rng, R * 0.5), cy + gauss(rng, R * 0.52), gauss(rng, R * 0.45)]);
  }
  const edges: Edge[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < N; i++) {
    const order = nodes
      .map((n, j) => ({ j, d: j === i ? Infinity : dist3(nodes[i], n) }))
      .sort((a, b) => a.d - b.d);
    for (let k = 0; k < 2; k++) {
      const j = order[k].j;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([i, j]);
      }
    }
  }
  return { nodes, edges };
}
const CONSTELLATION = constellation();

// how I work: a bold upward arrow (direction, growth, revenue)
function arrow(): Graph {
  const tail: Vec3 = [-2.5, 2.5, 0];
  const tip: Vec3 = [5, 13.5, 0];
  const mid1: Vec3 = [tail[0] + (tip[0] - tail[0]) / 3, tail[1] + (tip[1] - tail[1]) / 3, 0];
  const mid2: Vec3 = [tail[0] + ((tip[0] - tail[0]) * 2) / 3, tail[1] + ((tip[1] - tail[1]) * 2) / 3, 0];
  const dx = tip[0] - tail[0];
  const dy = tip[1] - tail[1];
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const barbLen = 3.2;
  const barbWide = 2.2;
  const barb1: Vec3 = [tip[0] - ux * barbLen - uy * barbWide, tip[1] - uy * barbLen + ux * barbWide, 0];
  const barb2: Vec3 = [tip[0] - ux * barbLen + uy * barbWide, tip[1] - uy * barbLen - ux * barbWide, 0];
  const nodes: Vec3[] = [tail, mid1, mid2, tip, barb1, barb2];
  const edges: Edge[] = [];
  for (const e of [[0, 1], [1, 2], [2, 3]] as Edge[]) {
    edges.push(e); // shaft weighted twice so it reads bold
    edges.push(e);
  }
  edges.push([3, 4], [3, 5]); // arrowhead barbs
  return { nodes, edges };
}
const ARROW = arrow();

// ─── INTRO HATS ──────────────────────────────────────────────────────────────
//  "I wear many hats." On the landing, the field morphs through one wireframe
//  icon per hat, in lock-step with the cycling text: a HAT (Solutions Engineer),
//  a parent + child (Father), a dancer (Performer), a circle of people
//  (Community builder), a wrench (Tinkerer), a lightbulb (Problem solver).
//  Each icon is a flat, camera-facing glyph so it reads cleanly head-on. The
//  glyphs sit in the mid-lower screen, directly under the "I wear many hats"
//  line (the title block - photo, name, hats - rides above them).
const HAT_CY = 2.6;

// shared graph utilities for composing/normalising the glyphs
function offsetY(g: Graph, dy: number): Graph {
  return { nodes: g.nodes.map(([x, y, z]) => [x, y + dy, z] as Vec3), edges: g.edges };
}
function mergeGraphs(...gs: Graph[]): Graph {
  const nodes: Vec3[] = [];
  const edges: Edge[] = [];
  for (const g of gs) {
    const base = nodes.length;
    for (const n of g.nodes) nodes.push(n);
    for (const [a, b] of g.edges) edges.push([a + base, b + base]);
  }
  return { nodes, edges };
}
// shift so the glyph's bounding box is centred on the origin
function recenter(g: Graph): Graph {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const [x, y] of g.nodes) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  return { nodes: g.nodes.map(([x, y, z]) => [x - cx, y - cy, z] as Vec3), edges: g.edges };
}
// scale uniformly so the dominant half-extent matches `half` (consistent sizes)
function fit(g: Graph, half: number): Graph {
  let m = 0;
  for (const [x, y] of g.nodes) m = Math.max(m, Math.abs(x), Math.abs(y));
  const s = m > 1e-6 ? half / m : 1;
  return { nodes: g.nodes.map(([x, y, z]) => [x * s, y * s, z] as Vec3), edges: g.edges };
}

// a simple posable stick person - fixed 14-node layout:
//   0..7 head ring · 8 neck · 9 hip · 10 armL · 11 armR · 12 legL · 13 legR
function person(
  cx: number,
  feetY: number,
  h: number,
  pose: { armL?: Vec3; armR?: Vec3; legL?: Vec3; legR?: Vec3 } = {},
): Graph {
  const nodes: Vec3[] = [];
  const edges: Edge[] = [];
  const headR = h * 0.14;
  const headCy = feetY + h - headR;
  const SEG = 8;
  for (let k = 0; k < SEG; k++) {
    const a = (k / SEG) * TAU;
    nodes.push([cx + Math.cos(a) * headR, headCy + Math.sin(a) * headR, 0]);
  }
  for (let k = 0; k < SEG; k++) edges.push([k, (k + 1) % SEG]);
  const neckY = headCy - headR;
  const hipY = feetY + h * 0.4;
  nodes.push([cx, neckY, 0]); // 8 neck
  nodes.push([cx, hipY, 0]); // 9 hip
  edges.push([8, 9], [8, 9]); // spine (bold)
  const shY = neckY - (neckY - hipY) * 0.22; // shoulder height
  const aL = pose.armL ?? ([-h * 0.2, -h * 0.16, 0] as Vec3);
  const aR = pose.armR ?? ([h * 0.2, -h * 0.16, 0] as Vec3);
  nodes.push([cx + aL[0], shY + aL[1], 0]); // 10 armL tip
  nodes.push([cx + aR[0], shY + aR[1], 0]); // 11 armR tip
  edges.push([8, 10], [8, 11]);
  const lL = pose.legL ?? ([-h * 0.15, -h * 0.4, 0] as Vec3);
  const lR = pose.legR ?? ([h * 0.15, -h * 0.4, 0] as Vec3);
  nodes.push([cx + lL[0], hipY + lL[1], 0]); // 12 legL foot
  nodes.push([cx + lR[0], hipY + lR[1], 0]); // 13 legR foot
  edges.push([9, 12], [9, 13]);
  return { nodes, edges };
}

// Solutions Engineer - a hat (the "many hats" anchor)
function hatIcon(): Graph {
  const nodes: Vec3[] = [
    [-5.4, -1.1, 0], [-3.1, -0.4, 0], [0, -0.7, 0], [3.1, -0.4, 0], [5.4, -1.1, 0], // brim 0-4
    [-2.5, -0.5, 0], [-1.9, 3.3, 0], [1.9, 3.3, 0], [2.5, -0.5, 0], // crown 5-8
    [-2.3, 0.1, 0], [2.3, 0.1, 0], // band 9-10
  ];
  const edges: Edge[] = [
    [0, 1], [1, 2], [2, 3], [3, 4], // brim arc
    [5, 6], [6, 7], [7, 8], [8, 5], // crown
    [9, 10], // band
    [5, 1], [8, 3], // seat crown on the brim
  ];
  return { nodes, edges };
}

// Father - a tall figure holding a small child's hand
function fatherIcon(): Graph {
  const parent = person(-1.9, -5, 9.0, { armR: [2.8, -2.3, 0] });
  const child = person(2.6, -5, 5.4, { armL: [-1.3, 0.2, 0] });
  const g = mergeGraphs(parent, child);
  g.edges.push([11, 24]); // parent.armR (11) holds child.armL (14+10)
  return g;
}

// Performer - a dancer mid-step (arms up, one leg kicked out)
function dancerIcon(): Graph {
  return person(0, -4.6, 9.4, {
    armL: [-2.7, 2.5, 0],
    armR: [2.7, 2.8, 0],
    legL: [-2.3, -3.6, 0],
    legR: [2.9, -2.3, 0],
  });
}

// Community builder - a circle of people gathered, hands joined
function communityIcon(): Graph {
  const nodes: Vec3[] = [];
  const edges: Edge[] = [];
  const cx = 0, cy = 0, ringR = 3.5, headR = 0.82, N = 6, SEG = 8;
  const inner: number[] = [];
  for (let p = 0; p < N; p++) {
    const a = (p / N) * TAU - Math.PI / 2;
    const hx = cx + Math.cos(a) * ringR;
    const hy = cy + Math.sin(a) * ringR;
    const head0 = nodes.length;
    for (let k = 0; k < SEG; k++) {
      const aa = (k / SEG) * TAU;
      nodes.push([hx + Math.cos(aa) * headR, hy + Math.sin(aa) * headR, 0]);
    }
    for (let k = 0; k < SEG; k++) edges.push([head0 + k, head0 + ((k + 1) % SEG)]);
    const inIdx = nodes.length;
    nodes.push([cx + Math.cos(a) * (ringR - 1.7), cy + Math.sin(a) * (ringR - 1.7), 0]);
    edges.push([head0, inIdx]); // short body toward the centre
    inner.push(inIdx);
  }
  for (let p = 0; p < N; p++) edges.push([inner[p], inner[(p + 1) % N]]); // joined hands
  return { nodes, edges };
}

// Tinkerer - an open-end wrench
function wrenchIcon(): Graph {
  const A: Vec3 = [-3.0, -4.0, 0];
  const B: Vec3 = [1.3, 1.4, 0];
  const dx = B[0] - A[0];
  const dy = B[1] - A[1];
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len; // along the handle
  const px = -uy, py = ux; // perpendicular
  const hw = 0.42; // half handle width
  const jw = 1.1; // jaw half width
  const jl = 2.0; // jaw length
  const nodes: Vec3[] = [
    [A[0] + px * hw, A[1] + py * hw, 0], // 0 handle L bottom
    [A[0] - px * hw, A[1] - py * hw, 0], // 1 handle R bottom
    [B[0] + px * hw, B[1] + py * hw, 0], // 2 handle L top
    [B[0] - px * hw, B[1] - py * hw, 0], // 3 handle R top
    [B[0] + px * jw, B[1] + py * jw, 0], // 4 jaw base L
    [B[0] - px * jw, B[1] - py * jw, 0], // 5 jaw base R
    [B[0] + px * jw + ux * jl, B[1] + py * jw + uy * jl, 0], // 6 jaw tip L
    [B[0] - px * jw + ux * jl, B[1] - py * jw + uy * jl, 0], // 7 jaw tip R
  ];
  const edges: Edge[] = [
    [0, 2], [1, 3], [0, 1], // handle sides + bottom cap
    [2, 4], [3, 5], // shoulders into the jaw
    [4, 5], // jaw inner base (the notch)
    [4, 6], [5, 7], // jaw prongs (open between 6 and 7)
  ];
  return { nodes, edges };
}

// Problem solver - a lightbulb (the idea)
function bulbIcon(): Graph {
  const nodes: Vec3[] = [];
  const edges: Edge[] = [];
  const bcy = 1.5, br = 2.5, SEG = 14;
  for (let k = 0; k < SEG; k++) {
    const a = (k / SEG) * TAU;
    nodes.push([Math.cos(a) * br, bcy + Math.sin(a) * br, 0]);
  }
  for (let k = 0; k < SEG; k++) edges.push([k, (k + 1) % SEG]);
  const topY = bcy - br + 0.1;
  const w = 0.9;
  const i0 = nodes.length;
  nodes.push([-w, topY, 0], [w, topY, 0], [w, topY - 1.6, 0], [-w, topY - 1.6, 0]); // base box i0..i0+3
  edges.push([i0, i0 + 1], [i0 + 1, i0 + 2], [i0 + 2, i0 + 3], [i0 + 3, i0]);
  const t1 = nodes.length;
  nodes.push([-w, topY - 0.55, 0], [w, topY - 0.55, 0]); // thread line 1
  edges.push([t1, t1 + 1]);
  const t2 = nodes.length;
  nodes.push([-w, topY - 1.1, 0], [w, topY - 1.1, 0]); // thread line 2
  edges.push([t2, t2 + 1]);
  const tip = nodes.length;
  nodes.push([-0.45, topY - 2.1, 0], [0.45, topY - 2.1, 0]); // contact tip
  edges.push([i0 + 3, tip], [i0 + 2, tip + 1], [tip, tip + 1]);
  const f = nodes.length;
  nodes.push(
    [-1.0, topY + 0.4, 0], [-0.45, bcy + 0.9, 0], [0.0, topY + 0.5, 0],
    [0.45, bcy + 0.9, 0], [1.0, topY + 0.4, 0], // filament (a W)
  );
  edges.push([f, f + 1], [f + 1, f + 2], [f + 2, f + 3], [f + 3, f + 4]);
  edges.push([i0, f], [i0 + 1, f + 4]); // filament legs down to the base
  return { nodes, edges };
}

// each glyph: recentre, scale to a common size, lift to the hero height
const HAT_HALF = 4.4;
const HATS: Graph[] = [
  hatIcon(), // 0 Solutions Engineer
  fatherIcon(), // 1 Father
  dancerIcon(), // 2 Performer
  communityIcon(), // 3 Community builder
  wrenchIcon(), // 4 Tinkerer
  bulbIcon(), // 5 Problem solver
].map((g) => offsetY(fit(recenter(g), HAT_HALF), HAT_CY));

function buildHats(count: number): Float32Array[] {
  return HATS.map((g, i) =>
    buildGraph(count, 20 + i, g, { nodeFrac: 0.3, nodeJitter: 0.12, edgeJitter: 0.06 }),
  );
}

// ─── 7 - contact: an iOS-style green check inside a rounded box ───────────────
function roundedRectPath(S: number, r: number, seg: number): Vec3[] {
  const centers: [number, number][] = [
    [S - r, S - r], [-(S - r), S - r], [-(S - r), -(S - r)], [S - r, -(S - r)],
  ];
  const start = [0, Math.PI / 2, Math.PI, 1.5 * Math.PI];
  const pts: Vec3[] = [];
  for (let c = 0; c < 4; c++) {
    const [cx, cy] = centers[c];
    for (let k = 0; k <= seg; k++) {
      const a = start[c] + (k / seg) * (Math.PI / 2);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0]);
    }
  }
  return pts;
}
function checkmarkBox(): Graph {
  const rim = roundedRectPath(4.2, 1.35, 5);
  const nodes: Vec3[] = rim.slice();
  const edges: Edge[] = [];
  for (let i = 0; i < nodes.length; i++) edges.push([i, (i + 1) % nodes.length]);
  const c0 = nodes.length;
  nodes.push([-2.2, 0.2, 0], [-0.7, -1.5, 0], [2.5, 2.0, 0]); // the check stroke
  edges.push([c0, c0 + 1], [c0, c0 + 1], [c0 + 1, c0 + 2], [c0 + 1, c0 + 2]); // weighted bold
  return { nodes, edges };
}
const CHECK = offsetY(fit(recenter(checkmarkBox()), 4.8), 7.0);

// ─── intro - scattered cloud the experience reforms from ─────────────────────
function introCloud(count: number): Float32Array {
  return build(count, 99, (i, t, rng) => {
    const inc = Math.acos(1 - 2 * rng());
    const az = rng() * TAU;
    const rad = R * (2.4 + rng() * 2.6);
    return [
      Math.sin(inc) * Math.cos(az) * rad,
      Math.cos(inc) * rad + HERO_Y,
      Math.sin(inc) * Math.sin(az) * rad,
    ];
  });
}

export function generateTargets(count: number): {
  initial: Float32Array;
  chapters: Float32Array[];
  hats: Float32Array[];
} {
  const hats = buildHats(count);
  return {
    initial: introCloud(count),
    chapters: [
      hats[0], // 0 hero - the first hat; the intro cycles through every hat
      buildGraph(count, 6, CONSTELLATION, { nodeFrac: 0.38, nodeJitter: 0.17, edgeJitter: 0.05 }), // 1 about (faded)
      buildGraph(count, 8, ARROW, { nodeFrac: 0.24, nodeJitter: 0.14, edgeJitter: 0.05 }), // 2 how I work
      buildGraph(count, 2, CLARITY, { nodeFrac: 0.1, nodeJitter: 0.09, edgeJitter: 0.12 }), // 3 approach
      buildGraph(count, 3, TOWERS, { nodeFrac: 0.3, nodeJitter: 0.11, edgeJitter: 0.05 }), // 4 experience
      buildGraph(count, 4, GRAPH, { nodeFrac: 0.26, nodeJitter: 0.12, edgeJitter: 0.05 }), // 5 record
      buildLattice(count, 5), // 6 toolbelt
      buildGraph(count, 7, CHECK, { nodeFrac: 0.28, nodeJitter: 0.1, edgeJitter: 0.05 }), // 7 contact
    ],
    hats,
  };
}
