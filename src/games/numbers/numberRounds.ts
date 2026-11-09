import type { ColorId } from '../../data/colors';
import { MAX_NUMBER, MIN_NUMBER } from '../../data/numbers';
import { OBJECTS, type ObjectKind } from '../../data/objects';
import { nextId, pick, randomInt, sample, shuffle } from '../../core/utils';

const COUNT_LEVELS = [5, 8, 10, 15, 20];

export function countLevelMax(correct: number): number {
  return COUNT_LEVELS[Math.min(COUNT_LEVELS.length - 1, Math.floor(correct / 3))];
}

export function findRangeMax(correct: number): number {
  return correct < 3 ? 5 : correct < 6 ? 9 : MAX_NUMBER;
}

export function findOptionCount(correct: number): number {
  return correct < 3 ? 2 : 3;
}

export function makeNumberOptions(answer: number, total = 3, spread = 3): number[] {
  const neighbours: number[] = [];
  for (let distance = 1; distance <= spread; distance++) {
    for (const value of [answer - distance, answer + distance]) {
      if (value >= MIN_NUMBER && value <= MAX_NUMBER) neighbours.push(value);
    }
  }
  return shuffle([answer, ...sample(neighbours, total - 1)]);
}

export interface CountRound {
  id: number;
  kind: ObjectKind;
  color: ColorId;
  count: number;
  options: number[];
}

export function makeCountRound(maxCount: number, previousCount?: number): CountRound {
  let count = randomInt(1, maxCount);
  while (count === previousCount && maxCount > 1) count = randomInt(1, maxCount);
  const object = pick(OBJECTS);
  return {
    id: nextId(),
    kind: object.kind,
    color: pick(object.colors),
    count,
    options: makeNumberOptions(count),
  };
}

export interface FindRound {
  id: number;
  target: number;
  options: number[];
}

export function makeFindRound(maxNumber: number, optionCount: number): FindRound {
  const range = Array.from({ length: maxNumber }, (_, index) => index + MIN_NUMBER);
  const options = sample(range, optionCount);
  return { id: nextId(), target: pick(options), options };
}
