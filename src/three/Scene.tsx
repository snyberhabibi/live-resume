"use client";

import { useState } from "react";
import * as THREE from "three";
import { Sky } from "./Sky";
import { Terrain } from "./Terrain";
import { Monument } from "./Monument";
import { Motes } from "./Motes";
import { Sun } from "./Sun";
import { Rig } from "./Rig";
import { Effects } from "./Effects";
import { useScene } from "./store";
import { MOTES, type QualityTier } from "./config";

const SEGMENTS: Record<QualityTier, number> = {
  ultra: 300,
  high: 240,
  med: 180,
  low: 120,
};

export function Scene() {
  const quality = useScene((s) => s.quality);
  const theme = useScene((s) => s.theme);
  const light = theme === "light";
  // the GodRays effect needs the sun mesh instance; wait for it to mount
  const [sun, setSun] = useState<THREE.Mesh | null>(null);

  return (
    <>
      <Sky />
      <Terrain segments={SEGMENTS[quality]} />
      <Sun onReady={setSun} />
      <Motes count={MOTES[quality]} />
      {/* the dust monument — assembles into a clear, story-relevant shape per chapter */}
      <Monument key={quality} quality={quality} />
      <Rig />
      <Effects
        key={`fx-${quality}-${sun ? "s" : "n"}-${theme}`}
        quality={quality}
        sun={sun}
        light={light}
      />
    </>
  );
}
