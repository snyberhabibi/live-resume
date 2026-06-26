"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";
import { SIM_VERT, SIM_FRAG, COPY_FRAG } from "./shaders/sim";
import { POINTS_VERT, POINTS_FRAG } from "./shaders/points";
import { generateTargets } from "./morphTargets";
import { useScene } from "./store";
import { fx, pulseTransition } from "./fx";
import { getAudioLevel } from "@/lib/audio";
import {
  SIM_SIZE,
  CHAPTER_ACCENT,
  LIGHT,
  MINIMAL_GRAPHIC_SECTIONS,
  MORPH_DURATION,
  PALETTE,
  type QualityTier,
} from "./config";

// The particles ARE the show - full opacity on the assembled shape. Heavy
// additive overlap still means per-grain opacity stays small.
// sizes bumped to keep the wireframes solid now that particle counts are lower
const SIZE_PARAMS: Record<QualityTier, { size: number; opacity: number }> = {
  ultra: { size: 1.25, opacity: 0.06 },
  high: { size: 1.55, opacity: 0.085 },
  med: { size: 1.95, opacity: 0.13 },
  low: { size: 2.6, opacity: 0.2 },
};

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function dataTex(arr: Float32Array, size: number) {
  const t = new THREE.DataTexture(arr, size, size, THREE.RGBAFormat, THREE.FloatType);
  t.needsUpdate = true;
  return t;
}

export function Monument({ quality }: { quality: QualityTier }) {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);

  const SIZE = SIM_SIZE[quality];
  const count = SIZE * SIZE;
  const params = SIZE_PARAMS[quality];

  // ── morph target textures (built once, client-side) ──
  const targets = useMemo(() => {
    const { initial, chapters } = generateTargets(count);
    return {
      initial: dataTex(initial, SIZE),
      chapters: chapters.map((c) => dataTex(c, SIZE)),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, SIZE]);

  useEffect(() => {
    return () => {
      targets.initial.dispose();
      targets.chapters.forEach((t) => t.dispose());
    };
  }, [targets]);

  // ── ping-pong render targets (float where supported, else half-float) ──
  const fboType = useMemo(() => {
    const ctx = gl.getContext();
    const isWebGL2 =
      typeof WebGL2RenderingContext !== "undefined" && ctx instanceof WebGL2RenderingContext;
    const floatOK = isWebGL2 && !!ctx.getExtension("EXT_color_buffer_float");
    return floatOK ? THREE.FloatType : THREE.HalfFloatType;
  }, [gl]);

  const fboSettings = useMemo(
    () => ({
      type: fboType,
      format: THREE.RGBAFormat,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      depthBuffer: false,
      stencilBuffer: false,
    }),
    [fboType],
  );
  const rtA = useFBO(SIZE, SIZE, fboSettings);
  const rtB = useFBO(SIZE, SIZE, fboSettings);
  const fbo = useRef({ read: rtA, write: rtB });

  // ── simulation material + offscreen quad scene ──
  const simMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SIM_VERT,
        fragmentShader: SIM_FRAG,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uPositions: { value: null },
          // seed from the CURRENT chapter so a mid-experience quality remount
          // doesn't snap the monument back to the hero shape
          uPrev: {
            value:
              useScene.getState().chapter === 0
                ? targets.initial
                : targets.chapters[useScene.getState().chapter],
          },
          uTarget: { value: targets.chapters[useScene.getState().chapter] },
          uMorph: { value: 0 },
          uTime: { value: 0 },
          uDelta: { value: 0.016 },
          uStiff: { value: 3.2 },
          uCurl: { value: 0.9 },
          uCurlFreq: { value: 0.16 },
          uMouse: { value: new THREE.Vector3(999, 999, 999) },
          uMouseActive: { value: 0 },
          uMouseStrength: { value: 13 },
          uReduced: { value: 0 },
          uBurst: { value: 0 },
          uBuildMax: { value: 17 },
          uWave: { value: 0 },
        },
      }),
    [targets],
  );

  const copyMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SIM_VERT,
        fragmentShader: COPY_FRAG,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uSrc: {
            value:
              useScene.getState().chapter === 0
                ? targets.initial
                : targets.chapters[useScene.getState().chapter],
          },
        },
      }),
    [targets],
  );

  const simScene = useMemo(() => new THREE.Scene(), []);
  const simCam = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);
  // construct with simMat so no throwaway default MeshBasicMaterial is created
  const simQuad = useMemo(() => new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMat), [simMat]);
  useEffect(() => {
    simScene.add(simQuad);
    return () => {
      simScene.remove(simQuad);
      simQuad.geometry.dispose();
      simMat.dispose();
      copyMat.dispose();
    };
  }, [simScene, simQuad, simMat, copyMat]);

  // ── points geometry (static reference UVs + per-particle randoms) ──
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const refs = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const colors = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const x = i % SIZE;
      const y = Math.floor(i / SIZE);
      refs[i * 3] = (x + 0.5) / SIZE;
      refs[i * 3 + 1] = (y + 0.5) / SIZE;
      refs[i * 3 + 2] = 0;
      seeds[i] = Math.random();
      colors[i] = Math.random();
    }
    g.setAttribute("position", new THREE.BufferAttribute(refs, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    g.setAttribute("aColor", new THREE.BufferAttribute(colors, 1));
    return g;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, SIZE]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const pointsMat = useMemo(
    () => {
      // light is the primary theme - initialise as ink/normal-blended so there's
      // no additive-glow flash on first paint
      const initLight = useScene.getState().theme === "light";
      return new THREE.ShaderMaterial({
        vertexShader: POINTS_VERT,
        fragmentShader: POINTS_FRAG,
        transparent: true,
        depthWrite: false,
        depthTest: true,
        blending: initLight ? THREE.NormalBlending : THREE.AdditiveBlending,
        uniforms: {
          uPositions: { value: null },
          uSize: { value: params.size },
          uTime: { value: 0 },
          uAsh: { value: new THREE.Color(PALETTE.ash) },
          uEmber: { value: new THREE.Color(PALETTE.ember) },
          uGold: { value: new THREE.Color(PALETTE.gold) },
          uAccent: { value: new THREE.Color(CHAPTER_ACCENT[useScene.getState().chapter]) },
          uAccentMix: { value: 0.55 },
          uOpacity: { value: params.opacity * (initLight ? 2.4 : 1) },
          uSpeedScale: { value: 0.12 },
          uLight: { value: initLight ? 1 : 0 },
          uInk: { value: new THREE.Color(LIGHT.ink) },
          uKinetic: { value: 0 },
        },
      });
    },
    [params],
  );
  useEffect(() => () => pointsMat.dispose(), [pointsMat]);

  // ── morph driver (transient subscription - no React re-renders) ──
  const morph = useRef({ t: 1, active: false });
  const accent = useRef(new THREE.Color(CHAPTER_ACCENT[useScene.getState().chapter]));
  const accentTarget = useRef(new THREE.Color(CHAPTER_ACCENT[useScene.getState().chapter]));

  const seeded = useRef(false);
  const framesRendered = useRef(0);
  const lastLight = useRef(useScene.getState().theme === "light");
  // fade the whole particle field away on "minimal graphic" sections (e.g. the
  // personal "who I am" beat) so the dust isn't fighting the content
  const graphicFade = useRef(MINIMAL_GRAPHIC_SECTIONS.has(useScene.getState().chapter) ? 0 : 1);

  useEffect(() => {
    // fresh load (chapter 0) reforms from the scattered cloud - the intro.
    // a mid-experience quality remount lands already-formed on its chapter.
    morph.current =
      useScene.getState().chapter === 0 ? { t: 0, active: true } : { t: 1, active: false };
    const unsub = useScene.subscribe(
      (s) => s.chapter,
      (chapter) => {
        simMat.uniforms.uPrev.value = simMat.uniforms.uTarget.value;
        simMat.uniforms.uTarget.value = targets.chapters[chapter];
        morph.current = { t: 0, active: true };
        accentTarget.current.set(CHAPTER_ACCENT[chapter]);
        // cinematic surge: FX + camera + dust burst - suppressed for reduced motion
        if (!useScene.getState().reducedMotion) pulseTransition();
      },
    );
    return unsub;
  }, [simMat, targets]);

  const tmpPlane = useMemo(() => new THREE.Plane(), []);
  const tmpRay = useMemo(() => new THREE.Ray(), []);
  const tmpV = useMemo(() => new THREE.Vector3(), []);
  const camDir = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const st = useScene.getState();
    const dt = Math.min(delta, 1 / 30);
    const time = state.clock.elapsedTime;

    // one-time seed: copy the intro cloud into both targets
    if (!seeded.current) {
      seeded.current = true;
      simQuad.material = copyMat;
      gl.setRenderTarget(fbo.current.read);
      gl.render(simScene, simCam);
      gl.setRenderTarget(fbo.current.write);
      gl.render(simScene, simCam);
      gl.setRenderTarget(null);
      simQuad.material = simMat;
    }

    // advance morph timer
    if (morph.current.active) {
      morph.current.t += dt / MORPH_DURATION;
      if (morph.current.t >= 1) {
        morph.current.t = 1;
        morph.current.active = false;
      }
    }
    simMat.uniforms.uMorph.value = easeInOut(morph.current.t);

    // pointer → world point on the monument plane (for repulsion)
    camera.getWorldDirection(camDir);
    tmpPlane.setFromNormalAndCoplanarPoint(camDir, tmpV.set(0, 4, 0));
    tmpRay.origin.copy(camera.position);
    tmpRay.direction
      .set(st.pointer.x, st.pointer.y, 0.5)
      .unproject(camera)
      .sub(camera.position)
      .normalize();
    const hit = tmpRay.intersectPlane(tmpPlane, tmpV);
    if (hit) simMat.uniforms.uMouse.value.copy(hit);
    simMat.uniforms.uMouseActive.value =
      st.pointerActive && !st.reducedMotion ? 1 : 0;
    simMat.uniforms.uReduced.value = st.reducedMotion ? 1 : 0;

    simMat.uniforms.uTime.value = time;
    simMat.uniforms.uDelta.value = dt;
    simMat.uniforms.uBurst.value = fx.transitionEnergy;
    // no crumble in this build - the career columns stand. (uWave stays 0.)
    simMat.uniforms.uWave.value = 0;

    // ── GPGPU step: read → write ──
    simMat.uniforms.uPositions.value = fbo.current.read.texture;
    gl.setRenderTarget(fbo.current.write);
    gl.render(simScene, simCam);
    gl.setRenderTarget(null);

    // render reads the freshly written buffer
    pointsMat.uniforms.uPositions.value = fbo.current.write.texture;
    pointsMat.uniforms.uTime.value = time;

    const light = st.theme === "light";
    // ink (normal blending) needs more coverage to read than additive glow
    // ease the particle field toward near-invisible on minimal-graphic sections
    const fadeTarget = MINIMAL_GRAPHIC_SECTIONS.has(st.chapter) ? 0 : 1;
    graphicFade.current += (fadeTarget - graphicFade.current) * (1 - Math.exp(-5 * dt));
    pointsMat.uniforms.uOpacity.value = params.opacity * (light ? 2.4 : 1) * graphicFade.current;
    pointsMat.uniforms.uLight.value += ((light ? 1 : 0) - pointsMat.uniforms.uLight.value) * (1 - Math.exp(-4 * dt));
    // kinetic energy: grains swell with scroll speed + audio loudness
    pointsMat.uniforms.uKinetic.value = Math.min(1, st.velocity * 1.4 + getAudioLevel() * 0.9);
    if (light !== lastLight.current) {
      lastLight.current = light;
      pointsMat.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
      pointsMat.needsUpdate = true;
    }

    // swap
    const t = fbo.current.read;
    fbo.current.read = fbo.current.write;
    fbo.current.write = t;

    // accent colour easing
    accent.current.lerp(accentTarget.current, 1 - Math.exp(-2.5 * dt));
    (pointsMat.uniforms.uAccent.value as THREE.Color).copy(accent.current);

    // signal readiness once a couple of frames have committed
    if (framesRendered.current < 3) {
      framesRendered.current++;
      if (framesRendered.current === 3 && !st.ready) st.setReady(true);
    }
  });

  return <points frustumCulled={false} geometry={geometry} material={pointsMat} />;
}
