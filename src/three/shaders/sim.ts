import { NOISE_GLSL } from "./noise";

// Fullscreen-quad passthrough (positions already in clip space).
export const SIM_VERT = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

// GPGPU integration step. State texture packs xyz = world position, w = speed.
// A position-only damped spring toward the (morph-blended) target keeps the
// system unconditionally stable & frame-rate independent; curl turbulence and
// pointer repulsion are added as displacement. During a morph the spring relaxes
// (dissolve) then re-engages (reform) - that's the "returns to dust / rebuilt".
export const SIM_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;

uniform sampler2D uPositions; // current state
uniform sampler2D uPrev;      // previous chapter target
uniform sampler2D uTarget;    // current chapter target
uniform float uMorph;         // 0..1 blend prev→target
uniform float uTime;
uniform float uDelta;         // clamped seconds
uniform float uStiff;         // spring stiffness
uniform float uCurl;          // turbulence amplitude
uniform float uCurlFreq;
uniform vec3  uMouse;         // world-space pointer
uniform float uMouseActive;
uniform float uMouseStrength;
uniform float uReduced;       // prefers-reduced-motion → calmer
uniform float uBurst;         // 0..1 transition surge
uniform float uBuildMax;      // height scale for bottom-up assembly
uniform float uWave;          // 0..1 - builder collapse wave sweeps left→right

${NOISE_GLSL}

vec3 hash33(vec2 p){
  vec3 q = vec3(dot(p, vec2(127.1, 311.7)),
                dot(p, vec2(269.5, 183.3)),
                dot(p, vec2(419.2, 371.9)));
  return fract(sin(q) * 43758.5453);
}

void main(){
  vec4 data = texture2D(uPositions, vUv);
  vec3 pos = data.xyz;

  vec3 tA = texture2D(uPrev, vUv).xyz;
  vec4 tBfull = texture2D(uTarget, vUv);
  vec3 tB = tBfull.xyz;
  float cat = tBfull.w; // builder: 1 = living tower, 0 = failed tower (1 elsewhere)
  float m = smoothstep(0.0, 1.0, uMorph);
  vec3 target = mix(tA, tB, m);

  // ── BUILDER COLLAPSE WAVE ──────────────────────────────────────────────────
  // A front sweeps left→right. As it passes a FAILED tower (cat == 0), that
  // tower topples into dust and settles as rubble; living towers stand firm.
  float waveX = mix(-15.0, 15.0, uWave);
  float waved = smoothstep(target.x - 1.4, target.x + 1.4, waveX);
  float collapse = (1.0 - cat) * waved;                 // 0..1, dead towers only
  vec3 h = hash33(vUv * 41.0);
  vec3 rubble = vec3(target.x + (h.x - 0.5) * 5.5 + 1.6, 0.25 + h.y * 1.0,
                     target.z + (h.z - 0.5) * 5.5);
  vec3 effTarget = mix(target, rubble, collapse);        // tower → rubble
  float toppling = collapse * (1.0 - collapse) * 4.0;    // peaks AS it falls

  // bell curve - peaks mid-morph: the cloud blows apart, then reassembles
  float dissolve = sin(m * 3.14159265) * (1.0 - uReduced * 0.7);

  // damped spring toward the effective target (stable at any dt)
  float k = 1.0 - exp(-uStiff * uDelta);
  k *= max(0.0, 1.0 - dissolve * 0.9 - uBurst * 0.25);
  // bottom-up assembly: lower particles settle before higher ones
  float heightFrac = clamp(effTarget.y / uBuildMax, 0.0, 1.0);
  k *= smoothstep(heightFrac - 0.30, heightFrac + 0.05, m);
  vec3 settled = mix(pos, effTarget, k);

  // curl turbulence - surges during dissolve, transitions, and the topple puff
  float curlAmp = uCurl * (0.18 + dissolve * 1.7 + uBurst * 1.3 + toppling * 2.6);
  vec3 curl = curlNoise(pos * uCurlFreq + vec3(0.0, uTime * 0.05, 0.0)) * curlAmp;

  // pointer SCULPTING: smooth radial push + a tangential swirl around the cursor
  vec3 d = pos - uMouse;
  float dist = length(d);
  float infl = exp(-dist * 0.22) * uMouseActive;
  vec3 radial = normalize(d + 1e-4) * (uMouseStrength * infl);
  vec3 tangent = normalize(cross(d + vec3(1e-4), vec3(0.0, 1.0, 0.0)) + 1e-4);
  vec3 swirl = tangent * (uMouseStrength * 0.55 * infl);

  // the wave shoves the toppling tower over to the right
  vec3 knock = vec3(toppling * 5.0, toppling * 1.0, 0.0);

  vec3 newPos = settled + (curl + radial + swirl + knock) * uDelta;

  float speed = length(newPos - pos) / max(uDelta, 1e-3);
  gl_FragColor = vec4(newPos, speed);
}
`;

// Copy/seed pass - used once to initialise both ping-pong targets from a
// CPU-built DataTexture (a scattered cloud the intro reforms from).
export const COPY_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uSrc;
void main(){ gl_FragColor = texture2D(uSrc, vUv); }
`;
