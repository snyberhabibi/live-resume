"use client";

import { useEffect, useRef, type ReactElement } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  DepthOfField,
  GodRays,
  Noise,
  Vignette,
  SMAA,
  ToneMapping,
} from "@react-three/postprocessing";
import {
  BlendFunction,
  KernelSize,
  ToneMappingMode,
  type BloomEffect,
  type ChromaticAberrationEffect,
  type EffectComposer as PPEffectComposer,
} from "postprocessing";
import { useScene } from "./store";
import { fx } from "./fx";
import { FX, type QualityTier } from "./config";

export function Effects({
  quality,
  sun,
  light,
}: {
  quality: QualityTier;
  sun: THREE.Mesh | null;
  light: boolean;
}) {
  const cfg = FX[quality];
  const caRef = useRef<ChromaticAberrationEffect | null>(null);
  const bloomRef = useRef<BloomEffect | null>(null);
  const composerRef = useRef<PPEffectComposer | null>(null);

  useEffect(() => () => composerRef.current?.dispose(), []);

  // chromatic aberration + bloom react to scroll velocity AND surge on a
  // chapter transition - that surge is what makes a scroll feel like a film cut
  useFrame(() => {
    const v = useScene.getState().velocity;
    const te = fx.transitionEnergy;
    if (caRef.current) {
      const amt = 0.0006 + v * 0.0035 + te * 0.009;
      caRef.current.offset.set(amt, amt);
    }
    if (bloomRef.current) {
      bloomRef.current.intensity = (light ? 0.12 : 0.6) + te * (light ? 0.18 : 0.6);
    }
  });

  const effects: ReactElement[] = [
    <Bloom
      key="bloom"
      ref={bloomRef}
      intensity={0.6}
      luminanceThreshold={0.5}
      luminanceSmoothing={0.28}
      mipmapBlur={cfg.bloomMips}
      radius={0.62}
      kernelSize={KernelSize.LARGE}
    />,
    cfg.godrays && sun && !light ? (
      <GodRays
        key="godrays"
        sun={sun}
        blendFunction={BlendFunction.SCREEN}
        samples={60}
        density={0.94}
        decay={0.92}
        weight={0.4}
        exposure={0.42}
        clampMax={0.9}
        blur
        kernelSize={KernelSize.SMALL}
      />
    ) : null,
    cfg.dof ? (
      <DepthOfField key="dof" focusDistance={0.027} focalLength={0.032} bokehScale={2.6} height={480} />
    ) : null,
    cfg.chroma ? (
      <ChromaticAberration
        key="ca"
        ref={caRef}
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.0008, 0.0008)}
        radialModulation
        modulationOffset={0.35}
      />
    ) : null,
    cfg.grain ? (
      <Noise key="grain" premultiply blendFunction={BlendFunction.SCREEN} opacity={0.06} />
    ) : null,
    <Vignette key="vig" offset={0.22} darkness={light ? 0.42 : 0.78} blendFunction={BlendFunction.NORMAL} />,
    <ToneMapping key="tm" mode={ToneMappingMode.ACES_FILMIC} />,
    <SMAA key="smaa" />,
  ].filter((e): e is ReactElement => e !== null);

  return (
    <EffectComposer ref={composerRef} multisampling={0} enableNormalPass={false}>
      {effects}
    </EffectComposer>
  );
}
