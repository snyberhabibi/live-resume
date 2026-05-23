"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { DesertTerrain } from "./desert-terrain";
import { SandParticles } from "./sand-particles";
import { SkyAtmosphere } from "./sky-atmosphere";
import { PostProcessing } from "./post-processing";
import {
  DesertStars,
  DesertSparkles,
  ChapterMonoliths,
  AccentLight,
} from "./desert-elements";
import { HeroPortrait } from "./hero-portrait";
import { DesertRocks } from "./desert-rocks";
import { ChapterScenes } from "./chapter-scenes";
import { useScrollStore } from "@/store/scroll";
import { chapters, chapterOrder, lerpColor } from "@/lib/colors";

function ScrollCamera() {
  const { camera } = useThree();
  const progress = useScrollStore((s) => s.progress);
  const targetPos = useRef(new THREE.Vector3(0, 2, 8));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    // Camera path: starts high and pulls forward through the desert
    const p = progress;

    // Camera position along scroll
    targetPos.current.set(
      Math.sin(p * Math.PI * 0.5) * 3,
      2.5 - p * 0.8 + Math.sin(p * Math.PI) * 1.5,
      8 - p * 50
    );

    // Look-at point leads the camera
    targetLook.current.set(
      Math.sin(p * Math.PI * 0.3) * 2,
      0.5 + Math.sin(p * Math.PI * 0.5) * 0.5,
      -p * 55
    );

    // Smooth lerp
    camera.position.lerp(targetPos.current, 0.05);
    const currentLook = new THREE.Vector3();
    camera.getWorldDirection(currentLook);
    camera.lookAt(
      camera.position.x + (targetLook.current.x - camera.position.x) * 0.05,
      camera.position.y +
        (targetLook.current.y - camera.position.y) * 0.05 -
        0.5,
      camera.position.z + (targetLook.current.z - camera.position.z) * 0.05 - 5
    );
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
    scene.fog = new THREE.FogExp2(fogColor, 0.025);
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
        Math.sin(t * 0.1) * 10,
        8,
        Math.cos(t * 0.1) * 10
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} color="#e8d5b7" />
      <directionalLight
        ref={dirRef}
        intensity={0.8}
        color="#ffd4a0"
        position={[5, 8, 5]}
      />
      <pointLight position={[0, 5, -20]} intensity={0.3} color="#7ec8e3" />
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
      <SkyAtmosphere />
      <DesertTerrain />
      <SandParticles />
      <DesertStars />
      <DesertSparkles />
      <ChapterMonoliths />
      <DesertRocks />
      <HeroPortrait />
      <ChapterScenes />
      <PostProcessing />
    </>
  );
}
