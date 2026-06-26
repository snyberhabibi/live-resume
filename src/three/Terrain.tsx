"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { TERRAIN_VERT, TERRAIN_FRAG } from "./shaders/terrain";
import { useScene } from "./store";
import { CHAPTER_ACCENT, LIGHT, PALETTE, TERRAIN_Y } from "./config";

const DARK_BASE = "#08080e";

export function Terrain({ segments }: { segments: number }) {
  const mat = useMemo(() => {
    const initLight = useScene.getState().theme === "light";
    return new THREE.ShaderMaterial({
      vertexShader: TERRAIN_VERT,
      fragmentShader: TERRAIN_FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmp: { value: 7 },
        uFreq: { value: 0.06 },
        uDrift: { value: 0.04 },
        uAccent: { value: new THREE.Color(initLight ? LIGHT.terrainContour : CHAPTER_ACCENT[0]) },
        uBase: { value: new THREE.Color(initLight ? LIGHT.terrainBase : DARK_BASE) },
        uFog: { value: new THREE.Color(initLight ? LIGHT.terrainFog : PALETTE.obsidian) },
        uFogNear: { value: 28 },
        uFogFar: { value: 150 },
        uLight: { value: initLight ? 1 : 0 },
      },
    });
  }, []);
  useEffect(() => () => mat.dispose(), [mat]);

  const accT = useRef(new THREE.Color());
  const baseT = useRef(new THREE.Color());
  const fogT = useRef(new THREE.Color());

  useFrame((state, delta) => {
    const st = useScene.getState();
    const light = st.theme === "light";
    mat.uniforms.uTime.value = state.clock.elapsedTime;

    if (light) {
      accT.current.set(LIGHT.terrainContour);
      baseT.current.set(LIGHT.terrainBase);
      fogT.current.set(LIGHT.terrainFog);
    } else {
      accT.current.set(CHAPTER_ACCENT[st.chapter]);
      baseT.current.set(DARK_BASE);
      fogT.current.set(PALETTE.obsidian);
    }
    const k = 1 - Math.exp(-2 * Math.min(delta, 0.05));
    (mat.uniforms.uAccent.value as THREE.Color).lerp(accT.current, k);
    (mat.uniforms.uBase.value as THREE.Color).lerp(baseT.current, k);
    (mat.uniforms.uFog.value as THREE.Color).lerp(fogT.current, k);
    mat.uniforms.uLight.value += ((light ? 1 : 0) - mat.uniforms.uLight.value) * k;
  });

  return (
    <mesh rotation-x={-Math.PI / 2} position-y={TERRAIN_Y} material={mat} frustumCulled={false}>
      <planeGeometry args={[600, 600, segments, segments]} />
    </mesh>
  );
}
