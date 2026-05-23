"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useScrollStore } from "@/store/scroll";
import { useModeStore } from "@/store/mode";

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

/** Floating monolith structures that appear in specific chapters */
export function ChapterMonoliths() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const { progress, chapterIndex } = useScrollStore.getState();
    groupRef.current.position.z = -progress * 50;
  });

  // Simple geometric structures placed along the camera path
  const structures = useMemo(
    () => [
      // Origin chapter - small warm structures
      { pos: [3, -0.5, -12] as const, scale: [0.3, 1.5, 0.3] as const, color: "#c9a067", rotY: 0.3 },
      { pos: [4, -0.8, -13] as const, scale: [0.2, 0.8, 0.2] as const, color: "#d4a76a", rotY: -0.2 },

      // Builder chapter - structures at various states
      { pos: [-4, -0.5, -22] as const, scale: [0.5, 2.5, 0.5] as const, color: "#b87d3a", rotY: 0.1 },
      { pos: [-2, -1.0, -24] as const, scale: [0.4, 0.6, 0.4] as const, color: "#8b6841", rotY: 0.5 }, // crumbled
      { pos: [-5, -0.3, -25] as const, scale: [0.3, 3.0, 0.3] as const, color: "#c9a067", rotY: -0.3 },
      { pos: [2, -0.7, -23] as const, scale: [0.6, 1.0, 0.3] as const, color: "#7a5c32", rotY: 0.8 }, // crumbled

      // Corporate chapter - tall dark monoliths
      { pos: [3, 0, -35] as const, scale: [1.0, 6.0, 1.0] as const, color: "#2a2a3a", rotY: 0 },
      { pos: [-3, 0, -37] as const, scale: [0.8, 5.0, 0.8] as const, color: "#1a1a2e", rotY: 0.1 },
      { pos: [0, 0, -39] as const, scale: [1.2, 7.0, 0.6] as const, color: "#222233", rotY: -0.05 },

      // Convergence - a single bright structure
      { pos: [0, -0.3, -48] as const, scale: [0.5, 3.5, 0.5] as const, color: "#4ade80", rotY: 0.2 },
    ],
    []
  );

  return (
    <group ref={groupRef}>
      {structures.map((s, i) => (
        <mesh
          key={i}
          position={[s.pos[0], s.pos[1], s.pos[2]]}
          rotation={[0, s.rotY, 0]}
          scale={[s.scale[0], s.scale[1], s.scale[2]]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={s.color}
            roughness={0.8}
            metalness={0.1}
            emissive={s.color}
            emissiveIntensity={0.05}
          />
        </mesh>
      ))}
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
