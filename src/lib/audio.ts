// Fully procedural audio - no asset files. A low ambient drone (detuned
// oscillators + filtered noise + a slow filter LFO) plus short synthesized UI
// blips. The graph is built lazily on the first user-gesture enable, so there's
// never an autoplay violation; master gain ramps in/out for the mute toggle.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let analyser: AnalyserNode | null = null;
let levelData: Uint8Array<ArrayBuffer> | null = null;
let smoothLevel = 0;
let enabled = false;

function buildGraph(ac: AudioContext) {
  master = ac.createGain();
  master.gain.value = 0;
  master.connect(ac.destination);

  analyser = ac.createAnalyser();
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.82;
  levelData = new Uint8Array(analyser.frequencyBinCount);
  master.connect(analyser);

  const droneGain = ac.createGain();
  droneGain.gain.value = 0.5;
  droneGain.connect(master);

  const lp = ac.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 320;
  lp.Q.value = 0.7;
  lp.connect(droneGain);

  const o1 = ac.createOscillator();
  o1.type = "sine";
  o1.frequency.value = 55;
  const o2 = ac.createOscillator();
  o2.type = "triangle";
  o2.frequency.value = 82.5;
  o2.detune.value = 6;
  const o3 = ac.createOscillator();
  o3.type = "sine";
  o3.frequency.value = 110;
  o3.detune.value = -4;
  const og = ac.createGain();
  og.gain.value = 0.25;
  o1.connect(og);
  o2.connect(og);
  o3.connect(og);
  og.connect(lp);

  // slow filter sweep so the drone breathes
  const lfo = ac.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.06;
  const lfoGain = ac.createGain();
  lfoGain.gain.value = 130;
  lfo.connect(lfoGain);
  lfoGain.connect(lp.frequency);

  // airy filtered-noise bed
  const noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
  const noise = ac.createBufferSource();
  noise.buffer = noiseBuf;
  noise.loop = true;
  const nf = ac.createBiquadFilter();
  nf.type = "bandpass";
  nf.frequency.value = 600;
  nf.Q.value = 0.5;
  const ng = ac.createGain();
  ng.gain.value = 0.04;
  noise.connect(nf);
  nf.connect(ng);
  ng.connect(droneGain);

  o1.start();
  o2.start();
  o3.start();
  lfo.start();
  noise.start();
}

function ensureAudio() {
  if (typeof window === "undefined") return;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    buildGraph(ctx);
  }
  if (ctx.state === "suspended") void ctx.resume();
}

export function setSoundEnabled(on: boolean) {
  enabled = on;
  if (on) ensureAudio();
  if (ctx && master) {
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(on ? 0.16 : 0, t + 0.7);
  }
}

// smoothed 0..1 loudness for audio-reactive visuals (0 while muted)
export function getAudioLevel(): number {
  if (!enabled || !analyser || !levelData) {
    smoothLevel *= 0.9;
    return smoothLevel;
  }
  analyser.getByteFrequencyData(levelData);
  let sum = 0;
  for (let i = 0; i < levelData.length; i++) sum += levelData[i];
  const avg = sum / levelData.length / 255;
  smoothLevel += (avg - smoothLevel) * 0.2;
  return smoothLevel;
}

export function uiTick(freq = 760) {
  if (!enabled || !ctx || !master) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  o.type = "triangle";
  o.frequency.value = freq;
  const g = ctx.createGain();
  o.connect(g);
  g.connect(master);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.05, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
  o.start(t);
  o.stop(t + 0.14);
}

export function chapterSwell() {
  if (!enabled || !ctx || !master) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  o.type = "sine";
  o.frequency.value = 170;
  const g = ctx.createGain();
  o.connect(g);
  g.connect(master);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.11, t + 0.08);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
  o.frequency.exponentialRampToValueAtTime(95, t + 0.9);
  o.start(t);
  o.stop(t + 0.95);
  uiTick(523);
}
