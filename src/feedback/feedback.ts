import { playSfx, say, type Utterance } from '../audio';
import { encouragement, praise } from '../audio/utterances';
import { celebrate } from '../effects/effects';

export function celebrateSuccess(message: Utterance = praise()): void {
  playSfx('fanfare');
  celebrate();
  say(message);
}

export function encourageRetry(): void {
  playSfx('gentle');
  say(encouragement());
}
