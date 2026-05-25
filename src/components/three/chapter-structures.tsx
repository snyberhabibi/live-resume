"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollStore } from "@/store/scroll";

// ─────────────────────────────────────────────
// Custom shader for desert monoliths
// Sand-textured stone with integrated fog, subtle noise displacement,
// and per-chapter accent glow on edges
// ─────────────────────────────────────────────

const monolithVertex = `
  uniform float uTime;
  uniform float uErode;
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying float vElevation;
  varying vec2 vUv;

  // Simplex noise for organic displacement
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g, l.zxy);
    vec3 i2 = max(g, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec3 pos = position;

    // Organic surface displacement — weathered stone
    float n = snoise(pos * 2.5 + uTime * 0.02) * 0.04;
    n += snoise(pos * 8.0) * 0.015;
    pos += normal * n * uErode;

    // Subtle wind sway at the top
    float topFactor = smoothstep(0.0, 1.0, pos.y * 0.3);
    pos.x += sin(uTime * 0.4 + pos.y * 0.5) * 0.01 * topFactor;

    vElevation = pos.y;
    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const monolithFragment = `
  uniform vec3 uBaseColor;
  uniform vec3 uTopColor;
  uniform vec3 uAccentColor;
  uniform float uAccentIntensity;
  uniform float uTime;
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  uniform float uOpacity;
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying float vElevation;
  varying vec2 vUv;

  void main() {
    // Gradient from base to top — sand darkens toward ground
    float heightMix = smoothstep(-0.5, 3.0, vElevation);
    vec3 color = mix(uBaseColor * 0.7, uTopColor, heightMix);

    // Simple directional lighting
    vec3 lightDir = normalize(vec3(0.5, 0.8, 0.3));
    float diffuse = max(dot(vNormal, lightDir), 0.0);
    float ambient = 0.35;
    color *= (ambient + diffuse * 0.65);

    // Edge glow — accent color on silhouette edges
    float edgeFactor = 1.0 - abs(dot(vNormal, normalize(cameraPosition - vWorldPos)));
    edgeFactor = pow(edgeFactor, 3.0);
    color += uAccentColor * edgeFactor * uAccentIntensity;

    // Subtle vertical lines — like ancient carved grooves
    float grooves = smoothstep(0.47, 0.5, fract(vUv.x * 12.0));
    color *= 1.0 - grooves * 0.08;

    // Fog integration
    float dist = length(cameraPosition - vWorldPos);
    float fogFactor = 1.0 - exp(-uFogDensity * dist * dist);
    color = mix(color, uFogColor, clamp(fogFactor, 0.0, 1.0));

    gl_FragColor = vec4(color, uOpacity);
  }
`;

// ─────────────────────────────────────────────
// Monolith component — single clean geometric form
// ─────────────────────────────────────────────

interface MonolithProps {
  position: [number, number, number];
  width: number;
  height: number;
  depth: number;
  baseColor: string;
  topColor: string;
  accentColor: string;
  accentIntensity?: number;
  erode?: number;
  rotationY?: number;
  tiltX?: number;
  tiltZ?: number;
  geometry?: "box" | "cylinder" | "hex";
}

function Monolith({
  position,
  width,
  height,
  depth,
  baseColor,
  topColor,
  accentColor,
  accentIntensity = 0.3,
  erode = 1.0,
  rotationY = 0,
  tiltX = 0,
  tiltZ = 0,
  geometry = "box",
}: MonolithProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBaseColor: { value: new THREE.Color(baseColor) },
      uTopColor: { value: new THREE.Color(topColor) },
      uAccentColor: { value: new THREE.Color(accentColor) },
      uAccentIntensity: { value: accentIntensity },
      uErode: { value: erode },
      uFogColor: { value: new THREE.Color("#16213e") },
      uFogDensity: { value: 0.0004 },
      uOpacity: { value: 1.0 },
    }),
    [baseColor, topColor, accentColor, accentIntensity, erode]
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
  });

  const geo = useMemo(() => {
    switch (geometry) {
      case "cylinder":
        return new THREE.CylinderGeometry(width / 2, width / 2, height, 8, 16);
      case "hex":
        return new THREE.CylinderGeometry(width / 2, width / 2, height, 6, 16);
      default:
        return new THREE.BoxGeometry(width, height, depth, 4, 16, 4);
    }
  }, [width, height, depth, geometry]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[tiltX, rotationY, tiltZ]}
      geometry={geo}
    >
      <shaderMaterial
        vertexShader={monolithVertex}
        fragmentShader={monolithFragment}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─────────────────────────────────────────────
// Chapter structure groups
// ─────────────────────────────────────────────

function OriginStructures() {
  return (
    <group position={[4, -2, -12]}>
      <Monolith
        position={[0, 1.8, 0]}
        width={0.4}
        height={4.0}
        depth={0.4}
        baseColor="#7a5c32"
        topColor="#d4a76a"
        accentColor="#e8a838"
        accentIntensity={0.4}
        geometry="hex"
      />
      <Monolith
        position={[1.2, 0.8, 0.5]}
        width={0.3}
        height={2.0}
        depth={0.3}
        baseColor="#6b5035"
        topColor="#c9a067"
        accentColor="#e8a838"
        accentIntensity={0.25}
        geometry="hex"
        tiltZ={0.05}
      />
    </group>
  );
}

function BuilderStructures() {
  return (
    <group position={[-4, -2, -22]}>
      {/* Still standing */}
      <Monolith
        position={[0, 2.5, 0]}
        width={0.35}
        height={5.5}
        depth={0.35}
        baseColor="#7a5c32"
        topColor="#c9a067"
        accentColor="#d4763c"
        accentIntensity={0.5}
        geometry="hex"
      />
      {/* Falling */}
      <Monolith
        position={[1.5, 1.0, 0.3]}
        width={0.3}
        height={2.5}
        depth={0.3}
        baseColor="#5a4228"
        topColor="#8b6841"
        accentColor="#d4763c"
        accentIntensity={0.2}
        erode={2.0}
        geometry="box"
        tiltZ={0.15}
      />
    </group>
  );
}

function CorporateMonoliths() {
  return (
    <group position={[3, -2, -36]}>
      <Monolith
        position={[-2, 4.0, 0]}
        width={1.0}
        height={8.0}
        depth={0.4}
        baseColor="#111827"
        topColor="#2a2a3a"
        accentColor="#475569"
        accentIntensity={0.5}
        erode={0.2}
        geometry="box"
      />
      <Monolith
        position={[0.5, 3.0, 1.0]}
        width={0.7}
        height={6.0}
        depth={0.35}
        baseColor="#0f172a"
        topColor="#1e293b"
        accentColor="#64748b"
        accentIntensity={0.4}
        erode={0.15}
        geometry="box"
      />
      <Monolith
        position={[2.5, 3.5, -0.5]}
        width={0.5}
        height={7.0}
        depth={0.3}
        baseColor="#0a0e1a"
        topColor="#222233"
        accentColor="#475569"
        accentIntensity={0.3}
        erode={0.1}
        geometry="box"
        tiltZ={0.02}
      />
    </group>
  );
}

function ConvergenceBeacon() {
  return (
    <group position={[0, -2, -48]}>
      <Monolith
        position={[0, 2.5, 0]}
        width={0.35}
        height={5.5}
        depth={0.35}
        baseColor="#1a3a2a"
        topColor="#4ade80"
        accentColor="#4ade80"
        accentIntensity={1.0}
        erode={0.4}
        geometry="hex"
      />
    </group>
  );
}

function CultureStructures() {
  const pillars = useMemo(() => {
    const count = 5;
    const radius = 2.0;
    const heights = [2.0, 3.0, 2.5, 3.2, 1.8];
    return Array.from({ length: count }, (_, i) => {
      const angle = Math.PI * 0.2 + (Math.PI * 0.6 / (count - 1)) * i;
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        h: heights[i],
      };
    });
  }, []);

  return (
    <group position={[-2, -2, -56]}>
      {pillars.map((p, i) => (
        <Monolith
          key={i}
          position={[p.x, p.h / 2, p.z]}
          width={0.15}
          height={p.h}
          depth={0.15}
          baseColor="#6b3020"
          topColor="#d4a076"
          accentColor="#e63946"
          accentIntensity={0.5}
          geometry="cylinder"
        />
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────
// Main export — all chapter structures
// ─────────────────────────────────────────────

export function ChapterStructures() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const { progress } = useScrollStore.getState();
    groupRef.current.position.z = -progress * 50;
  });

  return (
    <group ref={groupRef}>
      <OriginStructures />
      <BuilderStructures />
      <CorporateMonoliths />
      <ConvergenceBeacon />
      <CultureStructures />
    </group>
  );
}
