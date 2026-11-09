import { getAudioContext } from './sfx';
import { isSoundEnabled, subscribeToSound } from './soundSettings';
import { speak } from './speech';
import type { ClipId } from './voiceCatalog';
import type { Utterance } from './utterances';

interface VoicePack {
  /** URL absoluta del manifiesto, para resolver las rutas de los clips. */
  manifestUrl: string;
  clips: Record<string, string>;
}

interface BufferedClip {
  buffer: AudioBuffer;
}

const MANIFEST_NAME = 'voz/manifest.json';
const CLIP_GAP = 0.08;
const SILENCE_THRESHOLD = 0.002;
const SILENCE_PADDING = 0.025;

let packPromise: Promise<VoicePack | null> | null = null;
let unlocked = false;
let pending: Utterance | null = null;
let token = 0;
let gapTimer: number | undefined;
const sources = new Set<AudioBufferSourceNode>();
const bufferCache = new Map<ClipId, Promise<BufferedClip>>();

function manifestUrl(): string {
  return new URL(`${import.meta.env.BASE_URL}${MANIFEST_NAME}`, document.baseURI).href;
}

function readClips(value: unknown): Record<string, string> | null {
  if (!value || typeof value !== 'object') return null;
  const clips = (value as { clips?: unknown }).clips;
  if (!clips || typeof clips !== 'object') return null;
  const entries = Object.entries(clips).filter(
    (entry): entry is [string, string] => typeof entry[1] === 'string' && /\.(mp3|m4a|ogg|wav)$/i.test(entry[1]),
  );
  return entries.length > 0 ? Object.fromEntries(entries) : null;
}

async function loadPack(): Promise<VoicePack | null> {
  const url = manifestUrl();
  try {
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) return null;
    const data: unknown = await response.json();
    const clips = readClips(data);
    return clips ? { manifestUrl: url, clips } : null;
  } catch {
    return null;
  }
}

function ensurePack(): Promise<VoicePack | null> {
  if (!packPromise) packPromise = loadPack();
  return packPromise;
}

function stopSources(): void {
  if (gapTimer !== undefined) {
    window.clearTimeout(gapTimer);
    gapTimer = undefined;
  }
  sources.forEach((source) => {
    try {
      source.stop();
    } catch {
      /* ya había terminado */
    }
  });
  sources.clear();
}

function trimSilence(context: AudioContext, input: AudioBuffer): AudioBuffer {
  const threshold = SILENCE_THRESHOLD;
  let first = input.length;
  let last = -1;
  for (let channel = 0; channel < input.numberOfChannels; channel++) {
    const data = input.getChannelData(channel);
    for (let i = 0; i < data.length; i++) {
      if (Math.abs(data[i]) > threshold) {
        if (i < first) first = i;
        if (i > last) last = i;
      }
    }
  }
  if (last < 0) return input;

  const padding = Math.floor(input.sampleRate * SILENCE_PADDING);
  const start = Math.max(0, first - padding);
  const end = Math.min(input.length, last + padding + 1);
  if (start === 0 && end === input.length) return input;

  const output = context.createBuffer(input.numberOfChannels, end - start, input.sampleRate);
  for (let channel = 0; channel < input.numberOfChannels; channel++) {
    output.copyToChannel(input.getChannelData(channel).subarray(start, end), channel);
  }
  return output;
}

async function loadClip(pack: VoicePack, id: ClipId): Promise<BufferedClip> {
  const cached = bufferCache.get(id);
  if (cached) return cached;

  const loading = (async () => {
    const context = getAudioContext();
    if (!context) throw new Error('AudioContext no disponible');
    const clipPath = pack.clips[id];
    if (!clipPath) throw new Error(`Falta el clip ${id}`);
    const response = await fetch(new URL(clipPath, pack.manifestUrl).href);
    if (!response.ok) throw new Error(`No se pudo cargar el clip ${id}`);
    const raw = await response.arrayBuffer();
    const buffer = await context.decodeAudioData(raw);
    return { buffer: trimSilence(context, buffer) };
  })();

  bufferCache.set(id, loading);
  loading.catch(() => bufferCache.delete(id));
  return loading;
}

function startBuffers(buffers: AudioBuffer[]): void {
  const context = getAudioContext();
  if (!context) throw new Error('AudioContext no disponible');
  let when = context.currentTime + 0.04;
  for (const buffer of buffers) {
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(when);
    sources.add(source);
    source.onended = () => sources.delete(source);
    when += buffer.duration + CLIP_GAP;
  }
}

function fallback(text: string): void {
  speak(text);
}

async function play(utterance: Utterance): Promise<void> {
  if (!isSoundEnabled()) return;
  const current = ++token;
  stopSources();

  const pack = await ensurePack();
  if (current !== token || !isSoundEnabled()) return;
  if (!pack || utterance.parts.length === 0 || utterance.parts.some((id) => !pack.clips[id])) {
    fallback(utterance.text);
    return;
  }

  try {
    const clips = await Promise.all(utterance.parts.map((id) => loadClip(pack, id)));
    if (current !== token || !isSoundEnabled()) return;

    const context = getAudioContext();
    if (!context) throw new Error('AudioContext no disponible');
    if (context.state === 'suspended') await context.resume();
    if (current !== token || !isSoundEnabled()) return;
    if (context.state !== 'running') throw new Error('El audio sigue bloqueado');

    startBuffers(clips.map((clip) => clip.buffer));
  } catch {
    if (current === token && isSoundEnabled()) {
      stopSources();
      fallback(utterance.text);
    }
  }
}

export function say(utterance: Utterance): void {
  if (!isSoundEnabled()) return;
  if (!unlocked) {
    pending = utterance;
    return;
  }
  void play(utterance);
}

export function cancelVoice(): void {
  token += 1;
  pending = null;
  stopSources();
}

export function unlockVoice(): void {
  if (unlocked) return;
  unlocked = true;
  void ensurePack();
  if (pending) {
    const request = pending;
    pending = null;
    void play(request);
  }
}

subscribeToSound(() => {
  if (!isSoundEnabled()) cancelVoice();
});
