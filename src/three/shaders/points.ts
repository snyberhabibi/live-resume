// Render pass for the monument. The `position` attribute holds each particle's
// reference UV (refU, refV, 0) into the simulation texture — actual world
// position is fetched from uPositions in the vertex shader. Frustum culling is
// disabled on the Points object since CPU positions stay near origin.
export const POINTS_VERT = /* glsl */ `
precision highp float;
uniform sampler2D uPositions;
uniform float uSize;
uniform float uTime;
uniform float uKinetic; // scroll velocity + audio loudness → grains swell
attribute float aSeed;
attribute float aColor;
varying float vSpeed;
varying float vColor;
varying float vSeed;

void main(){
  vec4 data = texture2D(uPositions, position.xy);
  vec3 p = data.xyz;
  vSpeed = data.w;
  vColor = aColor;
  vSeed  = aSeed;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float twinkle = 0.75 + 0.25 * sin(uTime * 2.2 + aSeed * 40.0);
  float size = uSize * (0.35 + aSeed) * twinkle * (320.0 / max(-mv.z, 0.1));
  size *= (1.0 + uKinetic * 0.7);
  gl_PointSize = clamp(size, 0.5, 80.0);
  gl_Position = projectionMatrix * mv;
}
`;

export const POINTS_FRAG = /* glsl */ `
precision highp float;
uniform vec3  uAsh;
uniform vec3  uEmber;
uniform vec3  uGold;
uniform vec3  uAccent;
uniform float uAccentMix;
uniform float uOpacity;
uniform float uSpeedScale;
uniform float uLight; // 0 dark (additive glow) → 1 light (ink)
uniform vec3  uInk;
varying float vSpeed;
varying float vColor;
varying float vSeed;

void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float r = length(uv);
  float alpha = smoothstep(0.5, 0.0, r);
  alpha = pow(alpha, 1.5);

  // temperature from speed: settled ash → ember → hot gold while dissolving
  float t = clamp(vSpeed * uSpeedScale, 0.0, 1.0);
  vec3 col = mix(uAsh, uEmber, smoothstep(0.0, 0.5, t));
  col = mix(col, uGold, smoothstep(0.5, 1.0, t));
  col = mix(col, uAccent, uAccentMix);
  col *= (0.7 + vColor * 0.6);

  // incandescent core — only the very center of fast/hot grains
  col += uGold * smoothstep(0.18, 0.0, r) * (0.06 + t * 0.32);

  // light theme: grains become dark ink (rendered with NORMAL blending)
  col = mix(col, uInk * (0.7 + vColor * 0.5), uLight);

  // linear output — the EffectComposer (ToneMapping) handles encoding
  gl_FragColor = vec4(col, alpha * uOpacity);
}
`;
