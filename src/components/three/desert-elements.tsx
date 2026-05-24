"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useScrollStore } from "@/store/scroll";

/** Distant stars visible in the sky */
export function DesertStars() {
  const starsRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (starsRef.current) {
      const { progress } = useScrollStore.getState();
      // Stars follow camera loosely
      starsRef.current.position.z = -progress * 40;
      starsRef.current.rotation.y += 0.0001;
    }
  });

  return (
    <group ref={starsRef}>
      <Stars
        radius={60}
        depth={40}
        count={1500}
        factor={2}
        saturation={0.1}
        fade
        speed={0.3}
      />
    </group>
  );
}

/** Glowing dust sparkles near the camera */
export function DesertSparkles() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      const { progress } = useScrollStore.getState();
      groupRef.current.position.z = -progress * 45;
    }
  });

  return (
    <group ref={groupRef}>
      <Sparkles
        count={60}
        scale={20}
        size={1.5}
        speed={0.2}
        opacity={0.3}
        color="#d4b896"
      />
    </group>
  );
}

/** Glowing accent light that follows scroll and changes color per chapter */
export function AccentLight() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!lightRef.current) return;
    const { progress, chapter } = useScrollStore.getState();
    const t = state.clock.elapsedTime;

    lightRef.current.position.set(
      Math.sin(t * 0.3) * 5,
      3 + Math.sin(t * 0.5) * 1,
      -progress * 50 - 5
    );

    // Color per chapter
    const colors: Record<string, string> = {
      hero: "#7ec8e3",
      origin: "#e8a838",
      builder: "#d4763c",
      corporate: "#475569",
      convergence: "#4ade80",
      culture: "#e63946",
      contact: "#7ec8e3",
    };

    lightRef.current.color.set(colors[chapter] || "#7ec8e3");
  });

  return <pointLight ref={lightRef} intensity={2} distance={20} decay={2} />;
}
