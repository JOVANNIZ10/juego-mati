import type { CSSProperties } from 'react';

export type CSSVars = CSSProperties & { [key: `--${string}`]: string | number | undefined };

let serial = 0;

export function nextId(): number {
  serial += 1;
  return serial;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function sample<T>(items: readonly T[], count: number): T[] {
  return shuffle(items).slice(0, count);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function cx(...names: Array<string | false | null | undefined>): string {
  return names.filter(Boolean).join(' ');
}
