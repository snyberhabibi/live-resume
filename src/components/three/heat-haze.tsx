"use client";

import { forwardRef, useMemo } from "react";
import { Effect } from "postprocessing";
import { Uniform } from "three";

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uStrength;
  uniform float uSpeed;

  void mainUv(inout vec2 uv) {
    float distortionMask = smoothstep(0.0, 0.5, 1.0 - uv.y);
    float distortionX = sin(uv.y * 40.0 + uTime * uSpeed) * uStrength * distortionMask;
    float distortionY = cos(uv.x * 30.0 + uTime * uSpeed * 0.7) * uStrength * 0.5 * distortionMask;
    uv.x += distortionX;
    uv.y += distortionY;
  }
`;

class HeatHazeEffect extends Effect {
  constructor({ strength = 0.002, speed = 1.5 } = {}) {
    super("HeatHazeEffect", fragmentShader, {
      uniforms: new Map([
        ["uTime", new Uniform(0)],
        ["uStrength", new Uniform(strength)],
        ["uSpeed", new Uniform(speed)],
      ]),
    });
  }

  update(
    _renderer: any,
    _inputBuffer: any,
    deltaTime: number
  ) {
    const time = this.uniforms.get("uTime")!;
    time.value += deltaTime;
  }
}

export const HeatHaze = forwardRef<any, { strength?: number; speed?: number }>(
  ({ strength = 0.002, speed = 1.5 }, ref) => {
    const effect = useMemo(
      () => new HeatHazeEffect({ strength, speed }),
      [strength, speed]
    );
    return <primitive ref={ref} object={effect} dispose={null} />;
  }
);

HeatHaze.displayName = "HeatHaze";
