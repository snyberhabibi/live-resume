"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { SKY_VERT, SKY_FRAG } from "./shaders/sky";
import { useScene } from "./store";
import {
  CHAPTER_ACCENT,
  CHAPTER_ACCENT_LIGHT,
  CHAPTER_SKY,
  CHAPTER_SKY_LIGHT,
  LIGHT,
  PALETTE,
} from "./config";

export function Sky() {
  const scene = useThree((s) => s.scene);
  const mat = useMemo(() => {
    const initLight = useScene.getState().theme === "light";
    const sky = initLight ? CHAPTER_SKY_LIGHT[0] : CHAPTER_SKY[0];
    const acc = initLight ? CHAPTER_ACCENT_LIGHT[0] : CHAPTER_ACCENT[0];
    return new THREE.ShaderMaterial({
      vertexShader: SKY_VERT,
      fragmentShader: SKY_FRAG,
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uTop: { value: new THREE.Color(sky.top) },
        uHorizon: { value: new THREE.Color(sky.horizon) },
        uAccent: { value: new THREE.Color(acc) },
        uLight: { value: initLight ? 1 : 0 },
      },
    });
  }, []);
  useEffect(() => () => mat.dispose(), [mat]);

  const topT = useRef(new THREE.Color());
  const horT = useRef(new THREE.Color());
  const accT = useRef(new THREE.Color());
  const bg = useMemo(
    () => new THREE.Color(useScene.getState().theme === "light" ? LIGHT.bg : PALETTE.obsidian),
    [],
  );

  useFrame((state, delta) => {
    const st = useScene.getState();
    const light = st.theme === "light";
    mat.uniforms.uTime.value = state.clock.elapsedTime;

    if (light) {
      const sky = CHAPTER_SKY_LIGHT[st.chapter];
      topT.current.set(sky.top);
      horT.current.set(sky.horizon);
      accT.current.set(CHAPTER_ACCENT_LIGHT[st.chapter]);
    } else {
      topT.current.set(CHAPTER_SKY[st.chapter].top);
      horT.current.set(CHAPTER_SKY[st.chapter].horizon);
      accT.current.set(CHAPTER_ACCENT[st.chapter]);
    }

    const k = 1 - Math.exp(-2.2 * Math.min(delta, 0.05));
    (mat.uniforms.uTop.value as THREE.Color).lerp(topT.current, k);
    (mat.uniforms.uHorizon.value as THREE.Color).lerp(horT.current, k);
    (mat.uniforms.uAccent.value as THREE.Color).lerp(accT.current, k);
    mat.uniforms.uLight.value += ((light ? 1 : 0) - mat.uniforms.uLight.value) * k;

    bg.lerp(new THREE.Color(light ? LIGHT.bg : PALETTE.obsidian), k);
    scene.background = bg;
  });

  return (
    <mesh material={mat} frustumCulled={false} renderOrder={-1}>
      <sphereGeometry args={[300, 48, 32]} />
    </mesh>
  );
}
