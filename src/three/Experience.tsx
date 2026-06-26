"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { Scene } from "./Scene";
import { useScene } from "./store";
import { CAM_KEYS, DPR_CAP, LIGHT, PALETTE, type QualityTier } from "./config";

// Drive the renderer DPR from the active quality tier. (drei's AdaptiveDpr is
// inert here — nothing calls regress — so we wire DPR to the tier instead, and
// PerformanceMonitor steps the tier down under load.)
function DprController() {
  const setDpr = useThree((s) => s.setDpr);
  const quality = useScene((s) => s.quality);
  useEffect(() => {
    setDpr(DPR_CAP[quality]);
  }, [quality, setDpr]);
  return null;
}

function detectQuality(): QualityTier {
  if (typeof navigator === "undefined") return "high";
  const ua = navigator.userAgent;
  const mobile = /Android|iPhone|iPad|iPod|Mobile|Silk/i.test(ua);
  const cores = navigator.hardwareConcurrency || 4;
  // deviceMemory is non-standard but useful where present
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 4;
  if (mobile) return cores >= 6 && mem >= 4 ? "med" : "low";
  if (cores >= 10 && mem >= 8) return "ultra";
  if (cores >= 6) return "high";
  return "med";
}

const STEP_DOWN: Record<QualityTier, QualityTier> = {
  ultra: "high",
  high: "med",
  med: "low",
  low: "low",
};

export function Experience() {
  // detect once, synchronously seed the store before the scene first commits
  const [quality] = useState<QualityTier>(() => {
    const q = detectQuality();
    useScene.setState({ quality: q });
    return q;
  });
  const lastStepRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => useScene.getState().setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);

    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -((e.clientY / window.innerHeight) * 2 - 1);
      useScene.getState().setPointer(x, y, true);
    };
    const onLeave = () => {
      const p = useScene.getState().pointer;
      useScene.getState().setPointer(p.x, p.y, false);
    };
    const onTouch = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const t = e.touches[0];
      const x = (t.clientX / window.innerWidth) * 2 - 1;
      const y = -((t.clientY / window.innerHeight) * 2 - 1);
      useScene.getState().setPointer(x, y, true);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onLeave);

    return () => {
      mq.removeEventListener("change", apply);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onLeave);
    };
  }, []);

  return (
    <Canvas
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: THREE.NoToneMapping,
      }}
      dpr={DPR_CAP[quality]}
      camera={{ position: CAM_KEYS[0].pos, fov: CAM_KEYS[0].fov, near: 0.1, far: 1000 }}
      frameloop="always"
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
    >
      <color
        attach="background"
        args={[useScene.getState().theme === "light" ? LIGHT.bg : PALETTE.obsidian]}
      />
      <PerformanceMonitor
        iterations={6}
        onDecline={() => {
          // cooldown: each tier step-down rebuilds FBOs/targets (a brief stall),
          // so debounce to avoid cascading multiple rebuilds back-to-back
          const now = performance.now();
          if (now - lastStepRef.current < 8000) return;
          const s = useScene.getState();
          const next = STEP_DOWN[s.quality];
          if (next !== s.quality) {
            lastStepRef.current = now;
            s.setQuality(next);
          }
        }}
      />
      <DprController />
      <Scene />
    </Canvas>
  );
}
