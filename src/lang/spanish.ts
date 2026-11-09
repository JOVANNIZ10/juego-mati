import { getColor, type ColorId } from '../data/colors';
import type { ObjectInfo } from '../data/objects';

const UNITS = [
  'cero',
  'uno',
  'dos',
  'tres',
  'cuatro',
  'cinco',
  'seis',
  'siete',
  'ocho',
  'nueve',
  'diez',
  'once',
  'doce',
  'trece',
  'catorce',
  'quince',
  'dieciséis',
  'diecisiete',
  'dieciocho',
  'diecinueve',
  'veinte',
];

export function numberWord(value: number): string {
  return UNITS[value] ?? String(value);
}

export function colorName(color: ColorId): string {
  return getColor(color).name;
}

export function colorAdjective(color: ColorId, gender: 'm' | 'f', plural: boolean): string {
  return getColor(color).forms[(gender === 'f' ? 1 : 0) + (plural ? 2 : 0)];
}

export function describeGroup(count: number, object: ObjectInfo, color: ColorId): string {
  const single = count === 1;
  const determiner = single ? (object.gender === 'f' ? 'una' : 'un') : numberWord(count);
  const noun = single ? object.singular : object.plural;
  return [determiner, noun, colorAdjective(color, object.gender, !single)].join(' ');
}

export function countQuestion(object: ObjectInfo): string {
  return `¿${object.gender === 'f' ? 'Cuántas' : 'Cuántos'} ${object.plural} hay?`;
}

export function colorQuestion(object: ObjectInfo): string {
  return `¿De qué color es ${object.article} ${object.singular}?`;
}

export function colorStatement(object: ObjectInfo, color: ColorId): string {
  return `¡Es ${object.article} ${object.singular} ${colorAdjective(color, object.gender, false)}!`;
}

export function findColorPrompt(color: ColorId): string {
  return `¡Busca el color ${colorName(color)}!`;
}

export function findNumberPrompt(value: number): string {
  return `¡Busca el número ${numberWord(value)}!`;
}
