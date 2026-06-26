"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { damp, damp3 } from "maath/easing";
import { useScene } from "./store";
import { fx } from "./fx";
import { CAM_KEYS, CAM_KEYS_MOBILE, CHAPTER_COUNT } from "./config";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function Rig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const lookAt = useRef(new THREE.Vector3(...CAM_KEYS[0].target));
  const tmpPos = useMemo(() => new THREE.Vector3(), []);
  const tmpTgt = useMemo(() => new THREE.Vector3(), []);
  // cinematic intro: start deep in the dust, far back & high
  const introStartPos = useMemo(() => new THREE.Vector3(0, 9, 96), []);
  const introStartTgt = useMemo(() => new THREE.Vector3(0, 2, 0), []);
  const introT = useRef(0);
  const introDone = useRef(false);
  // touch/coarse pointers shouldn't drive the camera (it lurches while scrolling)
  const coarse = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
    [],
  );

  useFrame((state, delta) => {
    const st = useScene.getState();
    const dt = Math.min(delta, 1 / 30);

    const aspect = state.size.width / Math.max(1, state.size.height);
    const portrait = aspect < 1;
    const keys = portrait ? CAM_KEYS_MOBILE : CAM_KEYS;

    const scaled = st.progress * (CHAPTER_COUNT - 1);
    const i0 = Math.max(0, Math.min(CHAPTER_COUNT - 2, Math.floor(scaled)));
    const f = easeInOut(scaled - i0);
    const a = keys[i0];
    const b = keys[i0 + 1];

    tmpPos.set(
      lerp(a.pos[0], b.pos[0], f),
      lerp(a.pos[1], b.pos[1], f),
      lerp(a.pos[2], b.pos[2], f),
    );
    tmpTgt.set(
      lerp(a.target[0], b.target[0], f),
      lerp(a.target[1], b.target[1], f),
      lerp(a.target[2], b.target[2], f),
    );
    const fov = lerp(a.fov, b.fov, f);

    // Aspect-aware dolly for LANDSCAPE only - portrait uses pre-framed mobile keys
    // so the shapes stay centred and correctly sized instead of blowing up/cropping.
    if (!portrait) {
      const REF_ASPECT = 1.5;
      const factor = Math.min(3.2, Math.max(1, REF_ASPECT / aspect));
      if (factor > 1.001) {
        tmpPos.sub(tmpTgt).multiplyScalar(factor).add(tmpTgt);
      }
    }

    // gentle drifting orbit + pointer parallax - DESKTOP only. On touch the scene
    // stays perfectly still (no drift, no parallax) so it reads as deliberate and
    // doesn't lurch while scrolling.
    if (!st.reducedMotion && !coarse) {
      const ang = Math.sin(state.clock.elapsedTime * 0.08) * 0.12 + st.pointer.x * 0.22;
      const dx = tmpPos.x - tmpTgt.x;
      const dz = tmpPos.z - tmpTgt.z;
      const ca = Math.cos(ang);
      const sa = Math.sin(ang);
      tmpPos.x = tmpTgt.x + dx * ca - dz * sa;
      tmpPos.z = tmpTgt.z + dx * sa + dz * ca;
      tmpPos.y += st.pointer.y * 1.6;
    }

    // cinematic transition: a brief hand-held kick + push-in toward the subject
    const te = fx.transitionEnergy;
    if (te > 0.001 && !st.reducedMotion) {
      const tt = state.clock.elapsedTime;
      tmpPos.x += Math.sin(tt * 38) * 0.22 * te;
      tmpPos.y += Math.cos(tt * 31) * 0.22 * te;
      tmpPos.lerp(tmpTgt, 0.05 * te);
    }

    // cinematic fly-through intro: hold deep in the dust while the boot screen is
    // up, then swoop in to the hero framing once ready (skipped if scrolled/reduced)
    if (!introDone.current) {
      if (st.reducedMotion || st.progress > 0.03) {
        introDone.current = true;
      } else if (state.clock.elapsedTime < 1.0) {
        // hold deep in the dust while the boot screen is still up
        tmpPos.copy(introStartPos);
        tmpTgt.copy(introStartTgt);
      } else {
        introT.current = Math.min(1, introT.current + dt / 2.2);
        const e = 1 - Math.pow(1 - introT.current, 3); // easeOutCubic
        tmpPos.lerpVectors(introStartPos, tmpPos, e);
        tmpTgt.lerpVectors(introStartTgt, tmpTgt, e);
        if (introT.current >= 1) introDone.current = true;
      }
    }

    damp3(camera.position, tmpPos, 0.5, dt);
    damp3(lookAt.current, tmpTgt, 0.5, dt);
    camera.lookAt(lookAt.current);
    damp(camera, "fov", fov, 0.4, dt);
    camera.updateProjectionMatrix();

    // decay the transition surge (~0.6s)
    fx.transitionEnergy = Math.max(0, fx.transitionEnergy - dt * 1.6);
  });

  return null;
}
