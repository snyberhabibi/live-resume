"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useScene } from "./store";
import { LIGHT, PALETTE } from "./config";

// Foreground/volumetric dust motes drifting through the whole space. Because
// they live in world space, camera motion parallaxes them, and the ones nearest
// the lens blur into soft bokeh under DOF - that's most of the "depth" jump.
const VERT = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uSize;
attribute float aSeed;
varying float vFade;
varying float vSeed;
void main(){
  vec3 p = position;
  p.x += sin(uTime * 0.1 + aSeed * 6.2831) * 1.6;
  p.z += cos(uTime * 0.07 + aSeed * 9.0) * 1.6;
  // gentle perpetual upward drift, wrapped so motes recycle endlessly
  p.y = mod(p.y + uTime * 0.25 + aSeed * 60.0, 60.0) - 12.0;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float dist = max(-mv.z, 0.1);
  gl_PointSize = uSize * (0.5 + aSeed) * (200.0 / dist);
  gl_Position = projectionMatrix * mv;
  vFade = smoothstep(95.0, 8.0, dist);
  vSeed = aSeed;
}
`;

const FRAG = /* glsl */ `
precision highp float;
uniform vec3 uColor;
uniform vec3 uInk;
uniform float uLight;
varying float vFade;
varying float vSeed;
void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float a = smoothstep(0.5, 0.0, length(uv));
  a = pow(a, 1.4);
  vec3 c = mix(uColor * (0.55 + vSeed * 0.6), uInk * (0.5 + vSeed * 0.4), uLight);
  gl_FragColor = vec4(c, a * vFade * 0.45 * (1.0 + uLight * 1.6));
}
`;

export function Motes({ count }: { count: number }) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 150;
      pos[i * 3 + 1] = Math.random() * 60 - 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 150;
      seed[i] = Math.random();
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const material = useMemo(() => {
    const initLight = useScene.getState().theme === "light";
    return new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: initLight ? THREE.NormalBlending : THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 2.2 },
        uColor: { value: new THREE.Color(PALETTE.ember) },
        uInk: { value: new THREE.Color(LIGHT.ink) },
        uLight: { value: initLight ? 1 : 0 },
      },
    });
  }, []);

  const lastLight = useRef(useScene.getState().theme === "light");

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((state, delta) => {
    const st = useScene.getState();
    material.uniforms.uTime.value = state.clock.elapsedTime;
    if (st.reducedMotion) material.uniforms.uTime.value *= 0.3;

    const light = st.theme === "light";
    material.uniforms.uLight.value +=
      ((light ? 1 : 0) - material.uniforms.uLight.value) * (1 - Math.exp(-4 * Math.min(delta, 0.05)));
    if (light !== lastLight.current) {
      lastLight.current = light;
      material.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
      material.needsUpdate = true;
    }
  });

  return <points frustumCulled={false} geometry={geometry} material={material} />;
}
