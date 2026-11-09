import { isSoundEnabled } from './soundSettings';

export type SfxName =
  | 'tap'
  | 'pop'
  | 'bloop'
  | 'squeak'
  | 'bell'
  | 'sparkle'
  | 'success'
  | 'fanfare'
  | 'boing'
  | 'confetti'
  | 'gentle'
  | 'whoosh';

interface ToneOptions {
  type: OscillatorType;
  freq: number;
  start: number;
  duration: number;
  gain?: number;
  endFreq?: number;
}

type Synth = (ctx: AudioContext, out: AudioNode, t: number) => void;

let context: AudioContext | null = null;
let output: GainNode | null = null;

function getContext(): AudioContext | null {
  if (!context) {
    const AudioCtor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return null;
    context = new AudioCtor();
    output = context.createGain();
    output.gain.value = 0.5;
    output.connect(context.destination);
  }
  return context;
}

export function getAudioContext(): AudioContext | null {
  return getContext();
}

export function resumeAudio(): void {
  const ctx = getContext();
  if (ctx?.state === 'suspended') void ctx.resume();
}

function tone(ctx: AudioContext, out: AudioNode, { type, freq, start, duration, gain = 0.3, endFreq }: ToneOptions): void {
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, start + duration);
  env.gain.setValueAtTime(0.0001, start);
  env.gain.exponentialRampToValueAtTime(gain, start + 0.012);
  env.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(env).connect(out);
  osc.start(start);
  osc.stop(start + duration + 0.05);
}

function noise(ctx: AudioContext, out: AudioNode, start: number, duration: number, frequency: number, gain: number): void {
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = frequency;
  filter.Q.value = 0.9;
  const env = ctx.createGain();
  env.gain.setValueAtTime(gain, start);
  env.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  source.connect(filter).connect(env).connect(out);
  source.start(start);
  source.stop(start + duration);
}

const SYNTHS: Record<SfxName, Synth> = {
  tap: (ctx, out, t) => tone(ctx, out, { type: 'sine', freq: 880, start: t, duration: 0.09, gain: 0.18 }),
  pop: (ctx, out, t) => tone(ctx, out, { type: 'sine', freq: 720, endFreq: 260, start: t, duration: 0.16, gain: 0.3 }),
  bloop: (ctx, out, t) => tone(ctx, out, { type: 'sine', freq: 240, endFreq: 760, start: t, duration: 0.28, gain: 0.3 }),
  squeak: (ctx, out, t) => {
    tone(ctx, out, { type: 'triangle', freq: 900, endFreq: 1500, start: t, duration: 0.09, gain: 0.2 });
    tone(ctx, out, { type: 'triangle', freq: 1500, endFreq: 800, start: t + 0.09, duration: 0.14, gain: 0.18 });
  },
  bell: (ctx, out, t) => {
    tone(ctx, out, { type: 'sine', freq: 1318, start: t, duration: 1.1, gain: 0.2 });
    tone(ctx, out, { type: 'sine', freq: 2637, start: t, duration: 0.7, gain: 0.05 });
  },
  sparkle: (ctx, out, t) => {
    [1047, 1319, 1568, 2093].forEach((freq, i) =>
      tone(ctx, out, { type: 'sine', freq, start: t + i * 0.07, duration: 0.4, gain: 0.16 }),
    );
  },
  success: (ctx, out, t) => {
    [523, 659, 784, 1047].forEach((freq, i) =>
      tone(ctx, out, { type: 'triangle', freq, start: t + i * 0.09, duration: 0.45, gain: 0.2 }),
    );
  },
  fanfare: (ctx, out, t) => {
    [
      [523, 659, 784],
      [659, 784, 1047],
      [784, 1047, 1319],
    ].forEach((chord, i) =>
      chord.forEach((freq) => tone(ctx, out, { type: 'triangle', freq, start: t + i * 0.2, duration: 0.5, gain: 0.12 })),
    );
    noise(ctx, out, t + 0.4, 0.5, 3000, 0.22);
  },
  boing: (ctx, out, t) => {
    tone(ctx, out, { type: 'triangle', freq: 180, endFreq: 560, start: t, duration: 0.16, gain: 0.3 });
    tone(ctx, out, { type: 'triangle', freq: 560, endFreq: 240, start: t + 0.16, duration: 0.26, gain: 0.24 });
  },
  confetti: (ctx, out, t) => {
    noise(ctx, out, t, 0.35, 2600, 0.28);
    tone(ctx, out, { type: 'sine', freq: 420, endFreq: 1100, start: t, duration: 0.14, gain: 0.12 });
  },
  gentle: (ctx, out, t) => {
    tone(ctx, out, { type: 'sine', freq: 392, start: t, duration: 0.22, gain: 0.12 });
    tone(ctx, out, { type: 'sine', freq: 330, start: t + 0.16, duration: 0.3, gain: 0.1 });
  },
  whoosh: (ctx, out, t) => noise(ctx, out, t, 0.45, 900, 0.12),
};

const lastPlayed = new Map<SfxName, number>();

export function playSfx(name: SfxName): void {
  if (!isSoundEnabled()) return;
  const now = performance.now();
  if (now - (lastPlayed.get(name) ?? -Infinity) < 70) return;
  lastPlayed.set(name, now);
  const ctx = getContext();
  if (!ctx || !output) return;
  if (ctx.state === 'suspended') {
    void ctx.resume();
    return;
  }
  if (ctx.state !== 'running') return;
  SYNTHS[name](ctx, output, ctx.currentTime + 0.01);
}
