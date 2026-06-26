// Per-frame FX state read/written inside useFrame loops - deliberately NOT in
// React/zustand so it can change 60×/s without a single re-render or set() call.
export const fx = {
  transitionEnergy: 0, // spikes to 1 on a chapter change, decays each frame
};

export function pulseTransition() {
  fx.transitionEnergy = 1;
}
