"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { useScrollStore } from "@/store/scroll";
import { useModeStore } from "@/store/mode";

// Preload
useTexture.preload("/images/clay-01-kid-yusuf.jpg");
useTexture.preload("/images/clay-02-college-yusuf-dabka.jpg");
useTexture.preload("/images/clay-03-corporate-yusuf.jpg");
useTexture.preload("/images/clay-04-founder-yusuf-yallabites.jpg");
useTexture.preload("/images/clay-05-ai-builder-yusuf-fufu.jpg");
useTexture.preload("/images/clay-06-desert-yusuf-hero.jpg");

interface ClayFigureProps {
  url: string;
  chapterKey: string;
  position: [number, number, number];
  size?: number;
}

function ClayFigure({ url, chapterKey, position, size = 2.5 }: ClayFigureProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const texture = useTexture(url);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    const { chapter, chapterProgress } = useScrollStore.getState();
    const isActive = chapter === chapterKey;

    // Fade and scale based on chapter
    let targetOpacity = 0;
    let targetScale = 0.5;
    if (isActive) {
      const fadeIn = Math.min(1, chapterProgress * 4);
      const fadeOut = Math.min(1, (1 - chapterProgress) * 4);
      targetOpacity = fadeIn * fadeOut * 0.95;
      targetScale = 0.8 + fadeIn * fadeOut * 0.2;
    }

    materialRef.current.opacity +=
      (targetOpacity - materialRef.current.opacity) * 0.1;

    const s = meshRef.current.scale.x + (targetScale - meshRef.current.scale.x) * 0.08;
    meshRef.current.scale.setScalar(s);

    // Gentle hover
    meshRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
  });

  return (
    <Billboard position={position} follow={false}>
      <mesh ref={meshRef}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial
          ref={materialRef}
          map={texture}
          transparent
          opacity={0}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </Billboard>
  );
}

export function ClayFigures() {
  const mode = useModeStore((s) => s.mode);

  // Only show clay figures in yusuf mode
  if (mode === "recruiter") return null;

  return (
    <group>
      {/* Origin — Kid Yusuf with bookmarks */}
      <ClayFigure
        url="/images/clay-01-kid-yusuf.jpg"
        chapterKey="origin"
        position={[4, 0.5, -10]}
        size={2.5}
      />

      {/* Builder — Dabka Yusuf */}
      <ClayFigure
        url="/images/clay-02-college-yusuf-dabka.jpg"
        chapterKey="builder"
        position={[5, 0.5, -22]}
        size={3}
      />

      {/* Corporate — Suit Yusuf */}
      <ClayFigure
        url="/images/clay-03-corporate-yusuf.jpg"
        chapterKey="corporate"
        position={[-5, 0.5, -36]}
        size={2.5}
      />

      {/* Convergence — Founder Yusuf */}
      <ClayFigure
        url="/images/clay-04-founder-yusuf-yallabites.jpg"
        chapterKey="convergence"
        position={[4, 0.5, -47]}
        size={2.8}
      />

      {/* Culture — AI Builder Yusuf */}
      <ClayFigure
        url="/images/clay-05-ai-builder-yusuf-fufu.jpg"
        chapterKey="culture"
        position={[-4, 0.8, -56]}
        size={2.5}
      />
    </group>
  );
}
