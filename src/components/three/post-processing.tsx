"use client";

import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { HeatHaze } from "./heat-haze";

export function PostProcessing() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        luminanceThreshold={0.6}
        luminanceSmoothing={0.4}
        intensity={0.5}
        mipmapBlur
      />
      <HeatHaze strength={0.0015} speed={1.2} />
      <Vignette
        eskil={false}
        offset={0.2}
        darkness={0.8}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise
        premultiply
        blendFunction={BlendFunction.SOFT_LIGHT}
        opacity={0.15}
      />
    </EffectComposer>
  );
}
