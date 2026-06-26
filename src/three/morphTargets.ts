// ───────────────────────────────────────────────────────────────────────────
//  Morph targets - each section assembles into a clean WIREFRAME GRAPHIC built
//  from nodes + edges (the same drafting-table language as the toolbelt cube).
//  Between any two shapes the cloud blows apart into turbulent chaos and then
//  resolves into the next clean structure ("complexity → clarity").
//
//   0 hero       a faceted icosahedron        - a polished whole; identity
//   1 approach   a converging funnel          - complexity narrowed to a point
//   2 experience four ascending tower frames  - JPMorgan · Cisco · HashiCorp · IBM
//   3 impact     a rising performance graph   - never below the 100% baseline
//   4 toolbelt   a 4×4×4 lattice cube         - the structured toolkit
//   5 about      a loose constellation        - community, family, connection
//   6 contact    a hub-and-spoke network      - let's connect
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

// connect every pair of nodes whose spacing is within `factor` of the minimum -
// reconstructs the edges of a regular polyhedron from its vertices alone
function minEdges(nodes: Vec3[], factor = 1.06): Edge[] {
  let min = Infinity;
  for (let i = 0; i < nodes.length; i++)
    for (let j = i + 1; j < nodes.length; j++) {
      const d = dist3(nodes[i], nodes[j]);
      if (d > 1e-6 && d < min) min = d;
    }
  const edges: Edge[] = [];
  const thr = min * factor;
  for (let i = 0; i < nodes.length; i++)
    for (let j = i + 1; j < nodes.length; j++) {
      if (dist3(nodes[i], nodes[j]) <= thr) edges.push([i, j]);
    }
  return edges;
}

const HERO_Y = 4.6;

// ─── 0 - hero: faceted icosahedron (12 vertices, 30 edges) ───────────────────
function icosahedron(radius: number, cy: number): Graph {
  const t = (1 + Math.sqrt(5)) / 2;
  const raw: Vec3[] = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ];
  const nodes: Vec3[] = raw.map((v) => {
    const l = Math.hypot(v[0], v[1], v[2]);
    return [(v[0] / l) * radius, (v[1] / l) * radius + cy, (v[2] / l) * radius];
  });
  return { nodes, edges: minEdges(nodes, 1.05) };
}
const HERO = icosahedron(R * 0.82, HERO_Y);

// ─── 1 - approach: converging funnel (wide square rings → a point) ───────────
function funnel(): Graph {
  const LV = 5;
  const nodes: Vec3[] = [];
  const edges: Edge[] = [];
  for (let l = 0; l < LV; l++) {
    const f = l / (LV - 1); // 0 top → 1 bottom
    const y = 13.2 - f * 11.4;
    const half = R * 0.52 * (1 - f) + 0.18; // wide → near-point
    const b = nodes.length;
    nodes.push([-half, y, -half], [half, y, -half], [half, y, half], [-half, y, half]);
    edges.push([b, b + 1], [b + 1, b + 2], [b + 2, b + 3], [b + 3, b]);
    if (l > 0) {
      const p = b - 4;
      for (let k = 0; k < 4; k++) edges.push([p + k, b + k]);
    }
  }
  return { nodes, edges };
}
const FUNNEL = funnel();

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

// ─── 5 - contact: a hub-and-spoke network (let's connect) ────────────────────
function hub(): Graph {
  const nodes: Vec3[] = [];
  const edges: Edge[] = [];
  const cy = 6.0;
  const center = nodes.length;
  nodes.push([0, cy, 0]);
  const OUT = 8;
  const rr = R * 0.8;
  const tilt = 0.3;
  const c = Math.cos(tilt);
  const s = Math.sin(tilt);
  const outer: number[] = [];
  for (let i = 0; i < OUT; i++) {
    const a = (i / OUT) * TAU;
    const px = Math.cos(a) * rr;
    const py = Math.sin(a) * rr;
    const idx = nodes.length;
    nodes.push([px, py * c + cy, py * s]); // tilt around X for depth
    outer.push(idx);
    edges.push([center, idx]); // spoke
  }
  for (let i = 0; i < OUT; i++) edges.push([outer[i], outer[(i + 1) % OUT]]); // ring
  return { nodes, edges };
}
const HUB = hub();

// ─── 5 - about: a loose constellation (community / people / connection) ──────
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
} {
  return {
    initial: introCloud(count),
    chapters: [
      buildGraph(count, 1, HERO, { nodeFrac: 0.22, nodeJitter: 0.13, edgeJitter: 0.045 }),
      buildGraph(count, 2, FUNNEL, { nodeFrac: 0.24, nodeJitter: 0.12, edgeJitter: 0.05 }),
      buildGraph(count, 3, TOWERS, { nodeFrac: 0.3, nodeJitter: 0.11, edgeJitter: 0.05 }),
      buildGraph(count, 4, GRAPH, { nodeFrac: 0.26, nodeJitter: 0.12, edgeJitter: 0.05 }),
      buildLattice(count, 5),
      buildGraph(count, 6, CONSTELLATION, { nodeFrac: 0.38, nodeJitter: 0.17, edgeJitter: 0.05 }),
      buildGraph(count, 7, HUB, { nodeFrac: 0.3, nodeJitter: 0.14, edgeJitter: 0.05 }),
    ],
  };
}
