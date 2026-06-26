import { NOISE_GLSL } from "./noise";

// Infinite topographic void: a ridged-FBM displaced plane whose only "ink" is a
// set of glowing contour lines tracing elevation. Fades into fog at the edges.
export const TERRAIN_VERT = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
uniform float uDrift;
varying float vElev;
varying vec3  vWorld;

${NOISE_GLSL}

void main(){
  vec3 p = position;
  // ridged FBM, slowly drifting "downwind"
  float e = fbm(vec3(p.xy * uFreq + vec2(0.0, uTime * uDrift), uTime * 0.015));
  e = abs(e);
  vElev = e;
  p.z += e * uAmp;
  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const TERRAIN_FRAG = /* glsl */ `
precision highp float;
uniform vec3  uAccent;
uniform vec3  uBase;
uniform vec3  uFog;
uniform float uFogNear;
uniform float uFogFar;
uniform float uLight; // 0 dark → 1 light
varying float vElev;
varying vec3  vWorld;

void main(){
  // crisp topographic contour lines (anti-aliased via screen-space derivative)
  float bands = 16.0;
  float f = vElev * bands;
  float line = abs(fract(f - 0.5) - 0.5) / fwidth(f);
  float contour = 1.0 - clamp(line, 0.0, 1.0);

  vec3 col = uBase;
  // dark theme: glowing additive contour lines; light theme: ink lines (darken)
  col += uAccent * contour * 0.7 * (1.0 - uLight);
  col = mix(col, uAccent, contour * 0.85 * uLight);
  col += uAccent * pow(vElev, 2.0) * 0.08 * (1.0 - uLight); // ridges catch light

  float dist = length(cameraPosition - vWorld);
  float fog = smoothstep(uFogNear, uFogFar, dist);
  col = mix(col, uFog, fog);

  gl_FragColor = vec4(col, 1.0);
}
`;
