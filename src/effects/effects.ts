export type Effect =
  | { id: number; kind: 'confetti' }
  | { id: number; kind: 'burst'; x: number; y: number; color: string };

type EffectInput = { kind: 'confetti' } | { kind: 'burst'; x: number; y: number; color: string };

type Listener = (effect: Effect) => void;

const listeners = new Set<Listener>();
let serial = 0;

export function onEffect(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function emit(input: EffectInput): void {
  serial += 1;
  const effect: Effect = { ...input, id: serial };
  listeners.forEach((listener) => listener(effect));
}

export function celebrate(): void {
  emit({ kind: 'confetti' });
}

export function burstAt(x: number, y: number, color: string): void {
  emit({ kind: 'burst', x, y, color });
}
