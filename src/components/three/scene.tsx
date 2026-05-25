"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { DesertTerrain } from "./desert-terrain";
import { SandParticles } from "./sand-particles";
import { SkyAtmosphere } from "./sky-atmosphere";
import { PostProcessing } from "./post-processing";
import { DesertStars, AccentLight } from "./desert-elements";
import { ChapterStructures } from "./chapter-structures";
import { useScrollStore } from "@/store/scroll";
import { chapters, chapterOrder, lerpColor } from "@/lib/colors";

function ScrollCamera() {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 2.5, 8));
  const currentLook = useRef(new THREE.Vector3(0, 0, 3));

  useFrame(() => {
    const { progress } = useScrollStore.getState();
    const p = progress;

    // Gentle drone-like path through the desert
    // Smooth sine curves for x/y, linear z travel
    const targetX = Math.sin(p * Math.PI * 0.8) * 2.5;
    const targetY = 2.2 + Math.sin(p * Math.PI * 1.2) * 1.0;
    const targetZ = 8 - p * 55;

    // Look-at point — slightly ahead and lower
    const lookX = Math.sin(p * Math.PI * 0.4) * 1.5;
    const lookY = 0.8;
    const lookZ = targetZ - 8;

    // Buttery smooth lerp (0.03 = cinematic)
    currentPos.current.lerp(
      new THREE.Vector3(targetX, targetY, targetZ),
      0.03
    );
    currentLook.current.lerp(
      new THREE.Vector3(lookX, lookY, lookZ),
      0.03
    );

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLook.current);
  });

  return null;
}

function DynamicFog() {
  const { scene } = useThree();

  useFrame(() => {
    const { chapterIndex, chapterProgress } = useScrollStore.getState();
    const current = chapterOrder[chapterIndex];
    const next =
      chapterOrder[Math.min(chapterIndex + 1, chapterOrder.length - 1)];
    const fogColor = lerpColor(
      chapters[current].fog,
      chapters[next].fog,
      chapterProgress
    );
    scene.fog = new THREE.FogExp2(fogColor, 0.02);
    scene.background = new THREE.Color(chapters[current].sky);
  });

  return null;
}

function DesertLighting() {
  const dirRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state) => {
    if (dirRef.current) {
      const t = state.clock.elapsedTime;
      dirRef.current.position.set(
        Math.sin(t * 0.05) * 15,
        10,
        Math.cos(t * 0.05) * 15
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} color="#b8a088" />
      <directionalLight
        ref={dirRef}
        intensity={0.6}
        color="#ffd4a0"
        position={[5, 10, 5]}
      />
    </>
  );
}

export function SceneContent() {
  return (
    <>
      <ScrollCamera />
      <DynamicFog />
      <DesertLighting />
      <AccentLight />
      <Environment preset="night" environmentIntensity={0.15} />
      <SkyAtmosphere />
      <DesertTerrain />
      <SandParticles />
      <DesertStars />
      <ChapterStructures />
      <PostProcessing />
    </>
  );
}
