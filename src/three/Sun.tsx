"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useScene } from "./store";
import { CHAPTER_ACCENT } from "./config";

// A soft glowing orb at the heart of the monument. Alpha falls to zero at the
// rim (facing-ratio falloff) so it has NO hard edge — it dissolves into the
// dust bloom — while still being a bright source for the GodRays shafts.
const VERT = /* glsl */ `
varying vec3 vN;
varying vec3 vView;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalMatrix * normal;
  vView = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

const FRAG = /* glsl */ `
uniform vec3 uColor;
varying vec3 vN;
varying vec3 vView;
void main(){
  float f = max(dot(normalize(vN), normalize(vView)), 0.0);
  float a = pow(f, 2.4);
  gl_FragColor = vec4(uColor, a);
}
`;

export function Sun({ onReady }: { onReady: (m: THREE.Mesh | null) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const target = useRef(new THREE.Color(CHAPTER_ACCENT[useScene.getState().chapter]));

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uColor: { value: new THREE.Color(CHAPTER_ACCENT[0]) } },
      }),
    [],
  );

  useEffect(() => {
    onReady(meshRef.current);
    return () => {
      onReady(null);
      material.dispose();
    };
  }, [onReady, material]);

  useFrame((_, delta) => {
    const st = useScene.getState();
    // no glowing sun / god-ray source in the light theme
    if (meshRef.current) meshRef.current.visible = st.theme !== "light";
    target.current.set(CHAPTER_ACCENT[st.chapter]);
    (material.uniforms.uColor.value as THREE.Color).lerp(
      target.current,
      1 - Math.exp(-2 * Math.min(delta, 0.05)),
    );
  });

  return (
    <mesh ref={meshRef} position={[0, 3.5, 0]} material={material} frustumCulled={false}>
      <sphereGeometry args={[2.4, 24, 24]} />
    </mesh>
  );
}
