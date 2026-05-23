"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Preload } from "@react-three/drei";
import { SceneContent } from "./scene";

export function CanvasWrapper() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 2.5, 8], fov: 55, near: 0.1, far: 150 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <SceneContent />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
