import { NOISE_GLSL } from "./noise";

// Enveloping gradient sky on a large inverted sphere. Vertical gradient +
// horizon ember glow + a slow dust nebula + a sparse star dusting.
export const SKY_VERT = /* glsl */ `
precision highp float;
varying vec3 vDir;
void main(){
  vDir = position;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
}
`;

export const SKY_FRAG = /* glsl */ `
precision highp float;
uniform vec3  uTop;
uniform vec3  uHorizon;
uniform vec3  uAccent;
uniform float uTime;
uniform float uLight; // 0 dark → 1 light theme
varying vec3 vDir;

${NOISE_GLSL}

float hash(vec3 p){
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

void main(){
  vec3 dir = normalize(vDir);
  float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);
  vec3 col = mix(uHorizon, uTop, pow(h, 0.55));

  // horizon glow band (suppressed in light theme)
  float glow = pow(1.0 - abs(dir.y), 7.0);
  col += uAccent * glow * 0.3 * (1.0 - uLight * 0.65);

  // drifting nebular dust (dark theme only)
  float n = fbm(dir * 2.6 + vec3(0.0, uTime * 0.012, 0.0));
  col += uAccent * smoothstep(0.45, 1.0, n) * 0.05 * (1.0 - uLight);

  // sparse stars (dark theme only)
  float s = hash(floor(dir * 240.0));
  float star = smoothstep(0.9975, 1.0, s) * smoothstep(-0.05, 0.4, dir.y);
  col += vec3(star) * 0.6 * (1.0 - uLight);

  gl_FragColor = vec4(col, 1.0);
}
`;
