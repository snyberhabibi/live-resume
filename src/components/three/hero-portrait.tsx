"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { useScrollStore } from "@/store/scroll";
import { useModeStore } from "@/store/mode";

// Preload both textures
useTexture.preload("/images/yusuf-desert-golden-hour.png");
useTexture.preload("/images/yusuf-desert-night-stars.png");

export function HeroPortrait() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const mode = useModeStore((s) => s.mode);
  const progress = useScrollStore((s) => s.progress);

  const goldenTexture = useTexture("/images/yusuf-desert-golden-hour.png");
  const nightTexture = useTexture("/images/yusuf-desert-night-stars.png");

  useFrame(() => {
    if (!meshRef.current || !materialRef.current) return;

    // Fade out as user scrolls past hero
    const opacity = Math.max(0, 1 - progress * 8);
    materialRef.current.opacity = opacity;

    // Gentle float
    meshRef.current.position.y =
      1.5 + Math.sin(Date.now() * 0.0005) * 0.1;
  });

  const texture = mode === "recruiter" ? goldenTexture : nightTexture;

  return (
    <Billboard position={[0, 1.5, 2]} follow={false}>
      <mesh ref={meshRef}>
        <planeGeometry args={[6, 3.375]} />
        <meshBasicMaterial
          ref={materialRef}
          map={texture}
          transparent
          opacity={0.85}
          toneMapped={false}
          depthWrite={false}
          side={THREE.FrontSide}
        />
      </mesh>
    </Billboard>
  );
}
