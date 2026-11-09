import type { ColorId } from './colors';

export type ObjectKind =
  | 'apple'
  | 'star'
  | 'ball'
  | 'dino'
  | 'flower'
  | 'fish'
  | 'heart'
  | 'car'
  | 'banana'
  | 'frog'
  | 'orange'
  | 'cloud'
  | 'cookie'
  | 'cat';

export interface ObjectInfo {
  kind: ObjectKind;
  singular: string;
  plural: string;
  gender: 'm' | 'f';
  article: 'el' | 'la';
  /** Colores con los que aparece este objeto en los juegos. */
  colors: ColorId[];
}

export const OBJECTS: readonly ObjectInfo[] = [
  { kind: 'apple', singular: 'manzana', plural: 'manzanas', gender: 'f', article: 'la', colors: ['red', 'green', 'yellow'] },
  {
    kind: 'star',
    singular: 'estrella',
    plural: 'estrellas',
    gender: 'f',
    article: 'la',
    colors: ['yellow', 'orange', 'pink', 'blue', 'purple'],
  },
  {
    kind: 'ball',
    singular: 'pelota',
    plural: 'pelotas',
    gender: 'f',
    article: 'la',
    colors: ['red', 'blue', 'yellow', 'green', 'orange', 'pink', 'purple'],
  },
  {
    kind: 'dino',
    singular: 'dinosaurio',
    plural: 'dinosaurios',
    gender: 'm',
    article: 'el',
    colors: ['green', 'blue', 'orange', 'purple', 'pink', 'yellow'],
  },
  {
    kind: 'flower',
    singular: 'flor',
    plural: 'flores',
    gender: 'f',
    article: 'la',
    colors: ['pink', 'red', 'yellow', 'purple', 'orange', 'blue'],
  },
  {
    kind: 'fish',
    singular: 'pez',
    plural: 'peces',
    gender: 'm',
    article: 'el',
    colors: ['blue', 'orange', 'red', 'yellow', 'green', 'pink'],
  },
  { kind: 'heart', singular: 'corazón', plural: 'corazones', gender: 'm', article: 'el', colors: ['red', 'pink', 'purple'] },
  { kind: 'car', singular: 'coche', plural: 'coches', gender: 'm', article: 'el', colors: ['blue', 'red', 'yellow', 'green'] },
  { kind: 'banana', singular: 'plátano', plural: 'plátanos', gender: 'm', article: 'el', colors: ['yellow'] },
  { kind: 'frog', singular: 'rana', plural: 'ranas', gender: 'f', article: 'la', colors: ['green'] },
  { kind: 'orange', singular: 'naranja', plural: 'naranjas', gender: 'f', article: 'la', colors: ['orange'] },
  { kind: 'cloud', singular: 'nube', plural: 'nubes', gender: 'f', article: 'la', colors: ['white', 'blue'] },
  { kind: 'cookie', singular: 'galleta', plural: 'galletas', gender: 'f', article: 'la', colors: ['brown'] },
  { kind: 'cat', singular: 'gato', plural: 'gatos', gender: 'm', article: 'el', colors: ['black', 'orange'] },
];

const BY_KIND = Object.fromEntries(OBJECTS.map((object) => [object.kind, object])) as Record<ObjectKind, ObjectInfo>;

export function getObject(kind: ObjectKind): ObjectInfo {
  return BY_KIND[kind];
}

export interface ColorObject {
  kind: ObjectKind;
  color: ColorId;
}

export const COLOR_OBJECTS: readonly ColorObject[] = [
  { kind: 'ball', color: 'red' },
  { kind: 'car', color: 'blue' },
  { kind: 'banana', color: 'yellow' },
  { kind: 'frog', color: 'green' },
  { kind: 'orange', color: 'orange' },
  { kind: 'heart', color: 'pink' },
  { kind: 'flower', color: 'purple' },
  { kind: 'cloud', color: 'white' },
  { kind: 'cookie', color: 'brown' },
  { kind: 'cat', color: 'black' },
];
