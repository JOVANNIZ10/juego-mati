import { cancelSpeech as cancelSystemSpeech, unlockSpeech } from './speech';
import { cancelVoice, unlockVoice } from './voicePlayer';

export function unlockAudio(): void {
  unlockSpeech();
  unlockVoice();
}

export function cancelSpeech(): void {
  cancelVoice();
  cancelSystemSpeech();
}

export { speak, type SpeakOptions } from './speech';
export { say } from './voicePlayer';
export type { Utterance } from './utterances';
export { playSfx, type SfxName } from './sfx';
export { isSoundEnabled, setSoundEnabled, toggleSound, useSoundEnabled } from './soundSettings';
