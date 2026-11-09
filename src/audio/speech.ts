import { resumeAudio } from './sfx';
import { isSoundEnabled, subscribeToSound } from './soundSettings';

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
}

interface Request {
  text: string;
  options: SpeakOptions;
}

const LANGUAGE = 'es-ES';
const PREFERRED_VOICE = /helena|laura|elvira|m[oó]nica|luc[ií]a|sabina|google/i;
const synth: SpeechSynthesis | null =
  typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;

const MIN_SPEECH_WINDOW = 300;

let unlocked = false;
let pending: Request | null = null;
let selectedVoice: SpeechSynthesisVoice | null = null;
let spokenAt = 0;

function normalizeLang(lang: string): string {
  return lang.toLowerCase().replace('_', '-');
}

function findVoice(): SpeechSynthesisVoice | null {
  if (selectedVoice || !synth) return selectedVoice;
  const spanish = synth.getVoices().filter((voice) => normalizeLang(voice.lang).startsWith('es'));
  if (spanish.length === 0) return null;
  const score = (voice: SpeechSynthesisVoice) =>
    (normalizeLang(voice.lang) === 'es-es' ? 4 : 0) +
    (voice.localService ? 2 : 0) +
    (PREFERRED_VOICE.test(voice.name) ? 1 : 0);
  selectedVoice = [...spanish].sort((a, b) => score(b) - score(a))[0];
  return selectedVoice;
}

function speakNow({ text, options }: Request): void {
  if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return;
  const alreadySpeaking = synth.speaking || synth.pending;
  if (alreadySpeaking && performance.now() - spokenAt > MIN_SPEECH_WINDOW) synth.cancel();
  spokenAt = performance.now();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANGUAGE;
  utterance.voice = findVoice();
  utterance.rate = options.rate ?? 0.9;
  utterance.pitch = options.pitch ?? 1.15;
  utterance.volume = 1;
  synth.speak(utterance);
}

export function speak(text: string, options: SpeakOptions = {}): void {
  if (!isSoundEnabled()) return;
  if (!unlocked) {
    pending = { text, options };
    return;
  }
  speakNow({ text, options });
}

export function cancelSpeech(): void {
  pending = null;
  synth?.cancel();
}

export function unlockSpeech(): void {
  if (unlocked) return;
  unlocked = true;
  resumeAudio();
  if (pending) {
    const request = pending;
    pending = null;
    speak(request.text, request.options);
  }
}

subscribeToSound(() => {
  if (!isSoundEnabled()) cancelSpeech();
});
