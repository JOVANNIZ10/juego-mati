import { COLOR_IDS, getColor, type ColorId } from '../../data/colors';
import { MAX_NUMBER } from '../../data/numbers';
import { getObject, OBJECTS, type ObjectKind } from '../../data/objects';
import { describeGroup, numberWord } from '../../lang/spanish';
import { nextId, pick, randomInt, shuffle } from '../../core/utils';

export interface Item {
  kind: ObjectKind;
  color: ColorId;
}

export interface NumberItem {
  value: number;
  color: ColorId;
}

interface TaskBase {
  id: number;
  prompt: string;
}

export interface FindTask extends TaskBase {
  type: 'find';
  verb: 'Encuentra' | 'Toca';
  target: Item;
  count: number;
  board: Item[];
}

export interface PanelsTask extends TaskBase {
  type: 'panels';
  target: Item;
  count: number;
  panels: Item[][];
  answer: number;
}

export interface NumbersTask extends TaskBase {
  type: 'numbers';
  value: number;
  color: ColorId;
  board: NumberItem[];
}

export type CombinedTask = FindTask | PanelsTask | NumbersTask;

const COMBINED_OBJECTS = OBJECTS.filter((object) => object.colors.length > 1);

function randomItem(): Item {
  const object = pick(COMBINED_OBJECTS);
  return { kind: object.kind, color: pick(object.colors) };
}

function sameItem(a: Item, b: Item): boolean {
  return a.kind === b.kind && a.color === b.color;
}

function otherColor(item: Item): ColorId {
  return pick(getObject(item.kind).colors.filter((color) => color !== item.color));
}

function otherKind(kind: ObjectKind): ObjectKind {
  return pick(COMBINED_OBJECTS.filter((object) => object.kind !== kind)).kind;
}

function makeFindTask(level: number): FindTask {
  const target = randomItem();
  const count = randomInt(2, level < 2 ? 3 : 5);
  const size = Math.min(14, count + randomInt(5, 7 + Math.min(level, 3)));
  const board: Item[] = Array.from({ length: count }, () => target);
  while (board.length < size) {
    const item = randomItem();
    if (!sameItem(item, target)) board.push(item);
  }
  const verb = pick(['Encuentra', 'Toca'] as const);
  return {
    type: 'find',
    id: nextId(),
    verb,
    target,
    count,
    board: shuffle(board),
    prompt: `¡${verb} ${describeGroup(count, getObject(target.kind), target.color)}!`,
  };
}

function makePanelsTask(level: number): PanelsTask {
  const target = randomItem();
  const count = randomInt(1, level < 2 ? 3 : 4);
  const repeat = (times: number, item: Item) => Array.from({ length: times }, () => item);
  const wrongCount = count === 1 ? 2 : pick([count - 1, count + 1]);
  const correct = repeat(count, target);
  const distractors = shuffle([
    repeat(wrongCount, target),
    repeat(count, { kind: target.kind, color: otherColor(target) }),
    repeat(count, { kind: otherKind(target.kind), color: target.color }),
  ]).slice(0, 2);
  const panels = shuffle([correct, ...distractors]);
  return {
    type: 'panels',
    id: nextId(),
    target,
    count,
    panels,
    answer: panels.indexOf(correct),
    prompt: `¿Dónde hay ${describeGroup(count, getObject(target.kind), target.color)}?`,
  };
}

function makeNumbersTask(level: number): NumbersTask {
  const max = level < 2 ? 10 : MAX_NUMBER;
  const value = randomInt(1, max);
  const color = pick(COLOR_IDS);
  let other = value;
  while (other === value) other = randomInt(1, max);
  const board: NumberItem[] = [
    { value, color },
    { value, color: pick(COLOR_IDS.filter((candidate) => candidate !== color)) },
    { value: other, color },
  ];
  const size = 6 + Math.min(level, 3);
  while (board.length < size) {
    const item: NumberItem = { value: randomInt(1, MAX_NUMBER), color: pick(COLOR_IDS) };
    if (!(item.value === value && item.color === color)) board.push(item);
  }
  return {
    type: 'numbers',
    id: nextId(),
    value,
    color,
    board: shuffle(board),
    prompt: `¡Busca el número ${numberWord(value)} de color ${getColor(color).name}!`,
  };
}

export function makeCombinedTask(completed: number): CombinedTask {
  const level = Math.floor(completed / 3);
  const type = pick(['find', 'panels', 'numbers'] as const);
  if (type === 'find') return makeFindTask(level);
  if (type === 'panels') return makePanelsTask(level);
  return makeNumbersTask(level);
}
