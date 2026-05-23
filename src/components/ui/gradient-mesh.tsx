"use client";

import { useModeStore } from "@/store/mode";

export function GradientMesh() {
  const mode = useModeStore((s) => s.mode);
  return <div className="gradient-mesh" data-mode={mode} />;
}
