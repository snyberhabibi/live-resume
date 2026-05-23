"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Float,
  Text3D,
  Center,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense } from "react";
import { SkillNodes } from "./skill-nodes";
import { useModeStore } from "@/store/mode";

function SceneContent() {
  const mode = useModeStore((s) => s.mode);
  const isRecruiter = mode === "recruiter";

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight
        position={[-5, 5, -5]}
        intensity={0.5}
        color={isRecruiter ? "#6366f1" : "#22d3ee"}
      />

      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.5}>
        <Center>
          <SkillNodes />
        </Center>
      </Float>

      <Environment preset={isRecruiter ? "city" : "night"} />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          intensity={0.4}
        />
      </EffectComposer>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}

export function Scene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
