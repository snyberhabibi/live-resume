"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useScrollStore } from "@/store/scroll";
import { useModeStore } from "@/store/mode";
import { chapterOrder } from "@/lib/colors";

// Preload all scene textures
useTexture.preload("/images/scene-01-origin-gaza-kuwait-newyork.jpg");
useTexture.preload("/images/scene-02-builder-still-stand-returned-to-dust.jpg");
useTexture.preload("/images/scene-03-corporate-monoliths.jpg");
useTexture.preload("/images/scene-04-convergence-everything-lined-up.jpg");
useTexture.preload("/images/scene-05-culture-dabka-community.jpg");

interface ScenePlaneProps {
  url: string;
  chapterKey: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number];
}

function ScenePlane({
  url,
  chapterKey,
  position,
  rotation = [0, 0, 0],
  scale = [8, 4.5],
}: ScenePlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const texture = useTexture(url);
  const mode = useModeStore((s) => s.mode);

  useFrame(() => {
    if (!meshRef.current || !materialRef.current) return;
    const { chapter, chapterProgress } = useScrollStore.getState();
    const isActive = chapter === chapterKey;

    // Only show in "yusuf" mode — recruiter mode keeps it clean
    const modeVisible = mode === "yusuf";

    // Fade in/out based on chapter
    let targetOpacity = 0;
    if (isActive && modeVisible) {
      const fadeIn = Math.min(1, chapterProgress * 4);
      const fadeOut = Math.min(1, (1 - chapterProgress) * 4);
      targetOpacity = fadeIn * fadeOut * 0.9;
    }

    materialRef.current.opacity +=
      (targetOpacity - materialRef.current.opacity) * 0.08;

    // Subtle float
    meshRef.current.position.y =
      position[1] + Math.sin(Date.now() * 0.0003) * 0.05;
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <planeGeometry args={scale} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        transparent
        opacity={0}
        toneMapped={false}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function ChapterScenes() {
  return (
    <group>
      {/* Origin — food cart at mosque, golden hour */}
      <ScenePlane
        url="/images/scene-01-origin-gaza-kuwait-newyork.jpg"
        chapterKey="origin"
        position={[-4, 1.5, -10]}
        rotation={[0, 0.3, 0]}
        scale={[7, 3.94]}
      />

      {/* Builder — structures rising and crumbling */}
      <ScenePlane
        url="/images/scene-02-builder-still-stand-returned-to-dust.jpg"
        chapterKey="builder"
        position={[4, 1.5, -22]}
        rotation={[0, -0.25, 0]}
        scale={[8, 4.5]}
      />

      {/* Corporate — brutalist monoliths */}
      <ScenePlane
        url="/images/scene-03-corporate-monoliths.jpg"
        chapterKey="corporate"
        position={[-3, 2, -36]}
        rotation={[0, 0.2, 0]}
        scale={[9, 5.06]}
      />

      {/* Convergence — desert dawn, oasis */}
      <ScenePlane
        url="/images/scene-04-convergence-everything-lined-up.jpg"
        chapterKey="convergence"
        position={[3, 1.5, -47]}
        rotation={[0, -0.15, 0]}
        scale={[7, 3.94]}
      />

      {/* Culture — nighttime celebration */}
      <ScenePlane
        url="/images/scene-05-culture-dabka-community.jpg"
        chapterKey="culture"
        position={[0, 2, -56]}
        rotation={[0, 0, 0]}
        scale={[9, 5.06]}
      />
    </group>
  );
}
