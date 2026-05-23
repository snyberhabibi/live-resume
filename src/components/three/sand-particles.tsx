"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollStore } from "@/store/scroll";

const PARTICLE_COUNT = 800;

export function SandParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const progress = useScrollStore((s) => s.progress);

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = Math.random() * 8 - 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;

      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = (Math.random() - 0.3) * 0.005;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    return { positions: pos, velocities: vel };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    return geo;
  }, [positions]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3] += velocities[i * 3] + Math.sin(t * 0.5 + i) * 0.003;
      arr[i * 3 + 1] += velocities[i * 3 + 1];
      arr[i * 3 + 2] += velocities[i * 3 + 2];

      if (Math.abs(arr[i * 3]) > 30) arr[i * 3] *= -0.5;
      if (arr[i * 3 + 1] > 8) arr[i * 3 + 1] = -1;
      if (arr[i * 3 + 1] < -2) arr[i * 3 + 1] = 8;
      if (Math.abs(arr[i * 3 + 2]) > 30) arr[i * 3 + 2] *= -0.5;
    }

    posAttr.needsUpdate = true;
    pointsRef.current.position.z = progress * -40;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.06}
        color="#d4b896"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
