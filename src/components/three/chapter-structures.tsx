"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useScrollStore } from "@/store/scroll";
import { useModeStore } from "@/store/mode";

// Preload all GLB models
useGLTF.preload("/models/origin-structures.glb");
useGLTF.preload("/models/builder-structures.glb");
useGLTF.preload("/models/corporate-monoliths.glb");
useGLTF.preload("/models/convergence-beacon.glb");
useGLTF.preload("/models/culture-structures.glb");

interface ChapterModelProps {
  url: string;
  chapterKey: string;
  position: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  floatSpeed?: number;
  floatAmplitude?: number;
}

function ChapterModel({
  url,
  chapterKey,
  position,
  scale = 1,
  rotation = [0, 0, 0],
  floatSpeed = 0.3,
  floatAmplitude = 0.05,
}: ChapterModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const { chapter, chapterProgress } = useScrollStore.getState();
    const isActive = chapter === chapterKey;
    const t = state.clock.elapsedTime;

    // Fade in scale when chapter is active
    const targetScale = isActive ? scale : scale * 0.85;
    const currentScale = groupRef.current.scale.x;
    const newScale = currentScale + (targetScale - currentScale) * 0.03;
    groupRef.current.scale.setScalar(newScale);

    // Subtle float
    groupRef.current.position.y =
      position[1] + Math.sin(t * floatSpeed) * floatAmplitude;

    // Very subtle rotation
    groupRef.current.rotation.y =
      rotation[1] + Math.sin(t * 0.1) * 0.02;
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

export function ChapterStructures() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const { progress } = useScrollStore.getState();
    // Follow camera path (same z-travel as ChapterMonoliths had)
    groupRef.current.position.z = -progress * 50;
  });

  return (
    <group ref={groupRef}>
      {/* Origin — small warm ruins near z=-12 */}
      <ChapterModel
        url="/models/origin-structures.glb"
        chapterKey="origin"
        position={[3, -1.5, -12]}
        scale={1.2}
        rotation={[0, 0.3, 0]}
        floatAmplitude={0.03}
      />

      {/* Builder — mixed standing/crumbled structures near z=-22 */}
      <ChapterModel
        url="/models/builder-structures.glb"
        chapterKey="builder"
        position={[-3, -1.8, -22]}
        scale={1.0}
        rotation={[0, -0.2, 0]}
        floatAmplitude={0.02}
      />

      {/* Corporate — imposing dark monoliths near z=-36 */}
      <ChapterModel
        url="/models/corporate-monoliths.glb"
        chapterKey="corporate"
        position={[2, -2.0, -36]}
        scale={0.8}
        rotation={[0, 0.1, 0]}
        floatSpeed={0.15}
        floatAmplitude={0.01}
      />

      {/* Convergence — single bright beacon near z=-48 */}
      <ChapterModel
        url="/models/convergence-beacon.glb"
        chapterKey="convergence"
        position={[0, -1.5, -48]}
        scale={1.3}
        rotation={[0, 0, 0]}
        floatSpeed={0.5}
        floatAmplitude={0.08}
      />

      {/* Culture — gathering circle near z=-56 */}
      <ChapterModel
        url="/models/culture-structures.glb"
        chapterKey="culture"
        position={[-1, -1.8, -56]}
        scale={0.9}
        rotation={[0, 0.5, 0]}
        floatSpeed={0.4}
        floatAmplitude={0.04}
      />
    </group>
  );
}
