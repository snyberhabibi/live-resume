"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollStore } from "@/store/scroll";
import { chapters, chapterOrder, lerpColor } from "@/lib/colors";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.999, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uTopColor;
  uniform vec3 uBottomColor;
  uniform float uTime;

  varying vec2 vUv;

  void main() {
    float gradient = smoothstep(0.0, 0.8, vUv.y);

    // Subtle shimmer
    float shimmer = sin(vUv.x * 10.0 + uTime * 0.2) * 0.01;

    vec3 color = mix(uBottomColor, uTopColor, gradient + shimmer);
    gl_FragColor = vec4(color, 1.0);
  }
`;

export function SkyAtmosphere() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTopColor: { value: new THREE.Color("#1a1a2e") },
      uBottomColor: { value: new THREE.Color("#16213e") },
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (!materialRef.current) return;
    const { chapterIndex, chapterProgress } = useScrollStore.getState();

    const current = chapterOrder[chapterIndex];
    const next = chapterOrder[Math.min(chapterIndex + 1, chapterOrder.length - 1)];

    const skyColor = lerpColor(
      chapters[current].sky,
      chapters[next].sky,
      chapterProgress
    );
    const fogColor = lerpColor(
      chapters[current].fog,
      chapters[next].fog,
      chapterProgress
    );

    materialRef.current.uniforms.uTopColor.value.set(skyColor);
    materialRef.current.uniforms.uBottomColor.value.set(fogColor);
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
