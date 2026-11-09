import { COLOR_IDS, type ColorId } from '../../data/colors';
import { COLOR_OBJECTS, type ColorObject } from '../../data/objects';
import { nextId, pick, shuffle } from '../../core/utils';

export const BASIC_COLORS: readonly ColorId[] = ['red', 'blue', 'yellow', 'green'];

const SIMILAR: Partial<Record<ColorId, ColorId[]>> = {
  red: ['pink', 'orange', 'brown'],
  pink: ['red', 'purple'],
  orange: ['yellow', 'red', 'brown'],
  yellow: ['orange'],
  blue: ['purple'],
  purple: ['blue', 'pink'],
  brown: ['orange', 'red', 'black'],
  black: ['brown'],
};

export function colorPool(correct: number): readonly ColorId[] {
  return correct < 4 ? BASIC_COLORS : COLOR_IDS;
}

function clashes(a: ColorId, b: ColorId): boolean {
  return Boolean(SIMILAR[a]?.includes(b) || SIMILAR[b]?.includes(a));
}

export function makeColorOptions(target: ColorId, pool: readonly ColorId[], total = 3): ColorId[] {
  const chosen: ColorId[] = [target];
  for (const candidate of shuffle(pool)) {
    if (chosen.length === total) break;
    if (chosen.every((color) => color !== candidate && !clashes(color, candidate))) chosen.push(candidate);
  }
  return shuffle(chosen);
}

export interface ColorRound {
  id: number;
  target: ColorId;
  options: ColorId[];
}

export function makeColorRound(correct: number): ColorRound {
  const pool = colorPool(correct);
  const target = pick(pool);
  return { id: nextId(), target, options: makeColorOptions(target, pool) };
}

export interface ColorObjectRound {
  id: number;
  item: ColorObject;
  options: ColorId[];
}

export function makeColorObjectRound(correct: number): ColorObjectRound {
  const item = pick(COLOR_OBJECTS);
  return { id: nextId(), item, options: makeColorOptions(item.color, colorPool(correct)) };
}
