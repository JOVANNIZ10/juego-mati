import { describe, expect, it } from 'vitest';
import { COLORS } from '../data/colors';
import { COLOR_OBJECTS, OBJECTS } from '../data/objects';
import {
  colorQuestion,
  colorStatement,
  countQuestion,
  findColorPrompt,
  findNumberPrompt,
  numberWord,
} from '../lang/spanish';
import { CHATTER_CLIPS, ENCOURAGE_CLIPS, PRAISE_CLIPS } from './phrases';
import {
  colorSpeech,
  combinedSpeech,
  countHint,
  countQuestionSpeech,
  findColorSpeech,
  findNumberSpeech,
  numberSpeech,
  praiseWithColorObject,
  praiseWithNumber,
  type Utterance,
} from './utterances';
import {
  CLIPS,
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
} from './voiceCatalog';
import type { FindTask, NumbersTask, PanelsTask } from '../games/combined/combinedRounds';
import { getObject } from '../data/objects';

function expectComplete(utterance: Utterance): void {
  expect(utterance.parts.length).toBeGreaterThan(0);
  for (const part of utterance.parts) {
    expect(CLIPS[part], `falta el clip ${part}`).toBeDefined();
    expect(CLIPS[part].text.length).toBeGreaterThan(0);
  }
  expect(utterance.text.length).toBeGreaterThan(0);
}

describe('catálogo de voz', () => {
  it('todos los clips tienen texto y un tono válido', () => {
    const tones = new Set(['happy', 'soft', 'neutral', 'question', 'excited']);
    for (const [id, clip] of Object.entries(CLIPS)) {
      expect(clip.text.trim(), id).not.toBe('');
      expect(tones.has(clip.tone), id).toBe(true);
    }
  });

  it('los números y colores coinciden con la gramática española', () => {
    for (let value = 1; value <= 20; value++) {
      expect(clipText(numberClip(value))).toBe(numberWord(value));
      expect(clipText(findNumberClip(value))).toBe(findNumberPrompt(value));
    }
    for (const color of COLORS) {
      expect(clipText(colorClip(color.id))).toBe(color.name);
      expect(clipText(findColorClip(color.id))).toBe(findColorPrompt(color.id));
    }
  });

  it('cada forma del adjetivo tiene su clip', () => {
    for (const color of COLORS) {
      for (const gender of ['m', 'f'] as const) {
        for (const plural of [false, true]) {
          expect(CLIPS[adjectiveClip(color.id, gender, plural)]).toBeDefined();
        }
      }
    }
  });

  it('los objetos, sus plurales y sus preguntas están completos', () => {
    for (const object of OBJECTS) {
      expect(clipText(objectClip(object.kind, false))).toBe(object.singular);
      expect(clipText(objectClip(object.kind, true))).toBe(object.plural);
      expect(clipText(countQuestionClip(object.kind))).toBe(countQuestion(object));
      expect(clipText(colorQuestionClip(object.kind))).toBe(colorQuestion(object));
    }
  });

  it('los clips que se encadenan no llevan puntuación final', () => {
    for (const [id, clip] of Object.entries(CLIPS)) {
      if (!/^(num-|color-|adj-|sing-|plural-|func-)/.test(id)) continue;
      expect(clip.text, id).not.toMatch(/[.,!?;:]$/);
    }
  });

  it('las frases fijas de los objetos de colores coinciden con el texto', () => {
    for (const item of COLOR_OBJECTS) {
      expect(clipText(colorStatementClip(item.kind))).toBe(
        colorStatement(getObject(item.kind), item.color),
      );
    }
  });

  it('las listas de elogios, ánimos y charla existen', () => {
    for (const id of [...PRAISE_CLIPS, ...ENCOURAGE_CLIPS, ...CHATTER_CLIPS]) {
      expect(CLIPS[id]).toBeDefined();
    }
  });
});

describe('frases montadas', () => {
  it('las frases sencillas apuntan a clips completos', () => {
    for (let value = 1; value <= 20; value++) {
      expectComplete(numberSpeech(value));
      expectComplete(findNumberSpeech(value));
    }
    for (const color of COLORS) {
      expectComplete(colorSpeech(color.id));
      expectComplete(findColorSpeech(color.id));
    }
    for (const object of OBJECTS) expectComplete(countQuestionSpeech(object));
    expectComplete(countHint(7));
  });

  it('los elogios con número y con objeto montan partes existentes', () => {
    for (let i = 0; i < 40; i++) {
      expectComplete(praiseWithNumber((i % 20) + 1));
      expectComplete(praiseWithColorObject(COLOR_OBJECTS[i % COLOR_OBJECTS.length]));
    }
  });

  it('la tarea de encontrar monta el grupo con concordancia', () => {
    const task: FindTask = {
      id: 1,
      type: 'find',
      verb: 'Encuentra',
      target: { kind: 'star', color: 'yellow' },
      count: 3,
      board: [],
      prompt: '¡Encuentra tres estrellas amarillas!',
    };
    const utterance = combinedSpeech(task);
    expectComplete(utterance);
    expect(utterance.parts).toEqual([
      'func-encuentra',
      'num-3',
      'plural-star',
      'adj-amarillas',
    ]);
    expect(utterance.text).toBe(task.prompt);
  });

  it('la tarea de paneles usa el singular correcto', () => {
    const task: PanelsTask = {
      id: 2,
      type: 'panels',
      target: { kind: 'car', color: 'blue' },
      count: 1,
      panels: [],
      answer: 0,
      prompt: '¿Dónde hay un coche azul?',
    };
    const utterance = combinedSpeech(task);
    expectComplete(utterance);
    expect(utterance.parts).toEqual(['func-donde-hay', 'func-un', 'sing-car', 'color-blue']);
  });

  it('la tarea de números pide número y color', () => {
    const task: NumbersTask = {
      id: 3,
      type: 'numbers',
      value: 8,
      color: 'green',
      board: [],
      prompt: '¡Busca el número ocho de color verde!',
    };
    const utterance = combinedSpeech(task);
    expectComplete(utterance);
    expect(utterance.parts).toEqual([
      'func-busca-numero',
      'num-8',
      'func-de-color',
      'color-green',
    ]);
  });
});
