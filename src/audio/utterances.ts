import { getObject, type ColorObject, type ObjectInfo } from '../data/objects';
import type { ColorId } from '../data/colors';
import {
  colorQuestion,
  colorStatement,
  countQuestion,
  describeGroup,
  findColorPrompt,
  findNumberPrompt,
  numberWord,
} from '../lang/spanish';
import { pick } from '../core/utils';
import type { FindTask, PanelsTask } from '../games/combined/combinedRounds';
import type { NumbersTask } from '../games/combined/combinedRounds';
import {
  adjectiveClip,
  clipText,
  colorClip,
  colorQuestionClip,
  colorStatementClip,
  countQuestionClip,
  findColorClip,
  findNumberClip,
  numberClip,
  objectClip,
  type ClipId,
} from './voiceCatalog';
import { CHATTER_CLIPS, ENCOURAGE_CLIPS, PRAISE_CLIPS } from './phrases';

/**
 * Una frase puede venir de un único clip o montarse con varios.
 * `text` es siempre la frase completa: se usa si el pack no está disponible.
 */
export interface Utterance {
  parts: readonly ClipId[];
  text: string;
}

function fromClip(id: ClipId): Utterance {
  return { parts: [id], text: clipText(id) };
}

export function greeting(): Utterance {
  return fromClip('saludo');
}

export function sectionIntro(section: 'numbers' | 'colors'): Utterance {
  return fromClip(section === 'numbers' ? 'intro-numeros' : 'intro-colores');
}

export function praise(): Utterance {
  return fromClip(pick(PRAISE_CLIPS));
}

export function encouragement(): Utterance {
  return fromClip(pick(ENCOURAGE_CLIPS));
}

export function chatter(): Utterance {
  return fromClip(pick(CHATTER_CLIPS));
}

export function numberSpeech(value: number): Utterance {
  return fromClip(numberClip(value));
}

export function colorSpeech(color: ColorId): Utterance {
  return fromClip(colorClip(color));
}

export function countQuestionSpeech(object: ObjectInfo): Utterance {
  return { parts: [countQuestionClip(object.kind)], text: countQuestion(object) };
}

export function colorQuestionSpeech(object: ObjectInfo): Utterance {
  return { parts: [colorQuestionClip(object.kind)], text: colorQuestion(object) };
}

export function findNumberSpeech(value: number): Utterance {
  return { parts: [findNumberClip(value)], text: findNumberPrompt(value) };
}

export function findColorSpeech(color: ColorId): Utterance {
  return { parts: [findColorClip(color)], text: findColorPrompt(color) };
}

export function countHint(count: number): Utterance {
  return {
    parts: ['func-mira-son', numberClip(count)],
    text: `Mira, son ${numberWord(count)}.`,
  };
}

export function praiseWithNumber(count: number): Utterance {
  const chosen = pick(PRAISE_CLIPS);
  return {
    parts: [chosen, numberClip(count)],
    text: `${clipText(chosen)} ${numberWord(count)}.`,
  };
}

export function praiseWithColorObject(item: ColorObject): Utterance {
  const chosen = pick(PRAISE_CLIPS);
  const object = getObject(item.kind);
  return {
    parts: [chosen, colorStatementClip(item.kind)],
    text: `${clipText(chosen)} ${colorStatement(object, item.color)}`,
  };
}

function groupParts(count: number, object: ObjectInfo, color: ColorId): ClipId[] {
  if (count === 1) {
    return [
      object.gender === 'f' ? 'func-una' : 'func-un',
      objectClip(object.kind, false),
      adjectiveClip(color, object.gender, false),
    ];
  }
  return [
    numberClip(count),
    objectClip(object.kind, true),
    adjectiveClip(color, object.gender, true),
  ];
}

export function combinedFindSpeech(task: FindTask): Utterance {
  return {
    parts: [
      task.verb === 'Toca' ? 'func-toca' : 'func-encuentra',
      ...groupParts(task.count, getObject(task.target.kind), task.target.color),
    ],
    text: task.prompt,
  };
}

export function combinedPanelsSpeech(task: PanelsTask): Utterance {
  return {
    parts: [
      'func-donde-hay',
      ...groupParts(task.count, getObject(task.target.kind), task.target.color),
    ],
    text: task.prompt,
  };
}

export function combinedNumbersSpeech(task: NumbersTask): Utterance {
  return {
    parts: ['func-busca-numero', numberClip(task.value), 'func-de-color', colorClip(task.color)],
    text: task.prompt,
  };
}

export function combinedSpeech(task: FindTask | PanelsTask | NumbersTask): Utterance {
  if (task.type === 'find') return combinedFindSpeech(task);
  if (task.type === 'panels') return combinedPanelsSpeech(task);
  return combinedNumbersSpeech(task);
}

/** El grupo descrito, por si hace falta en pruebas o para futuras frases. */
export function describeGroupParts(count: number, object: ObjectInfo, color: ColorId): ClipId[] {
  return groupParts(count, object, color);
}

/** Texto completo del grupo, equivalente a la frase montada por partes. */
export function describeGroupText(count: number, object: ObjectInfo, color: ColorId): string {
  return describeGroup(count, object, color);
}
