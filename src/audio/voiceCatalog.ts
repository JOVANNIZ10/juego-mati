import clips from './voice/clips.json';
import { colorName, colorAdjective } from '../lang/spanish';
import type { ColorId } from '../data/colors';
import type { ObjectInfo } from '../data/objects';

export type ClipTone = 'happy' | 'soft' | 'neutral' | 'question' | 'excited';
export type ClipId = keyof typeof clips;

export interface ClipInfo {
  text: string;
  tone: ClipTone;
}

export const CLIPS = clips as Record<ClipId, ClipInfo>;

export function clipText(id: ClipId): string {
  return CLIPS[id].text;
}

export function numberClip(value: number): ClipId {
  return `num-${value}` as ClipId;
}

export function colorClip(color: ColorId): ClipId {
  return `color-${color}` as ClipId;
}

/**
 * Los clips de adjetivo reutilizan el nombre del color cuando la forma es idéntica.
 * Así el pack no guarda dos veces "azul", "verde" o "naranja".
 */
export function adjectiveClip(color: ColorId, gender: 'm' | 'f', plural: boolean): ClipId {
  const form = colorAdjective(color, gender, plural);
  return (form === colorName(color) ? `color-${color}` : `adj-${form}`) as ClipId;
}

export function objectClip(kind: ObjectInfo['kind'], plural: boolean): ClipId {
  return `${plural ? 'plural' : 'sing'}-${kind}` as ClipId;
}

export function countQuestionClip(kind: ObjectInfo['kind']): ClipId {
  return `q-cuantas-${kind}` as ClipId;
}

export function colorQuestionClip(kind: ObjectInfo['kind']): ClipId {
  return `q-color-${kind}` as ClipId;
}

export function findNumberClip(value: number): ClipId {
  return `find-numero-${value}` as ClipId;
}

export function findColorClip(color: ColorId): ClipId {
  return `find-color-${color}` as ClipId;
}

export function colorStatementClip(kind: ObjectInfo['kind']): ClipId {
  return `es-${kind}` as ClipId;
}
