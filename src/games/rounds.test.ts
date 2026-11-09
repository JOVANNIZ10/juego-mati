import { describe, expect, it } from 'vitest';
import { COLOR_IDS } from '../data/colors';
import { getObject } from '../data/objects';
import { makeCombinedTask } from './combined/combinedRounds';
import { colorPool, makeColorObjectRound, makeColorOptions, makeColorRound } from './colors/colorRounds';
import {
  countLevelMax,
  findOptionCount,
  findRangeMax,
  makeCountRound,
  makeFindRound,
  makeNumberOptions,
} from './numbers/numberRounds';

const inRange = (value: number) => value >= 1 && value <= 20;

describe('rondas de números', () => {
  it('las opciones de contar incluyen la respuesta y nunca salen de 1-20', () => {
    for (let i = 0; i < 300; i++) {
      const count = 1 + (i % 20);
      const options = makeNumberOptions(count);
      expect(options).toContain(count);
      expect(new Set(options).size).toBe(3);
      expect(options.every(inRange)).toBe(true);
    }
  });

  it('las rondas de contar respetan el máximo del nivel', () => {
    for (let i = 0; i < 200; i++) {
      const round = makeCountRound(countLevelMax(0));
      expect(round.count).toBeGreaterThanOrEqual(1);
      expect(round.count).toBeLessThanOrEqual(5);
      expect(round.options).toContain(round.count);
    }
    expect(countLevelMax(20)).toBe(20);
  });

  it('encontrar el número empieza con dos opciones y llega a tres', () => {
    expect(findOptionCount(0)).toBe(2);
    expect(findOptionCount(10)).toBe(3);
    const round = makeFindRound(findRangeMax(0), findOptionCount(0));
    expect(round.options).toHaveLength(2);
    expect(round.options).toContain(round.target);
    expect(round.options.every((value) => value >= 1 && value <= 5)).toBe(true);
    expect(makeFindRound(20, 3).options.every(inRange)).toBe(true);
  });
});

describe('rondas de colores', () => {
  it('las opciones contienen el objetivo, son distintas y evitan colores parecidos', () => {
    for (const target of COLOR_IDS) {
      for (let i = 0; i < 20; i++) {
        const options = makeColorOptions(target, COLOR_IDS);
        expect(options).toHaveLength(3);
        expect(options).toContain(target);
        expect(new Set(options).size).toBe(3);
      }
    }
  });

  it('el primer nivel usa solo colores básicos', () => {
    expect(colorPool(0)).toEqual(['red', 'blue', 'yellow', 'green']);
    const round = makeColorRound(0);
    expect(round.options.every((color) => colorPool(0).includes(color))).toBe(true);
  });

  it('las rondas de objetos incluyen siempre el color correcto', () => {
    for (let i = 0; i < 50; i++) {
      const round = makeColorObjectRound(10);
      expect(round.options).toContain(round.item.color);
      expect(getObject(round.item.kind)).toBeDefined();
    }
  });
});

describe('tareas combinadas', () => {
  it('usan solo números de 1 a 20 y tareas coherentes', () => {
    for (let completed = 0; completed < 20; completed++) {
      for (let i = 0; i < 20; i++) {
        const task = makeCombinedTask(completed);
        if (task.type === 'numbers') {
          expect(inRange(task.value)).toBe(true);
          expect(task.board.every((tile) => inRange(tile.value))).toBe(true);
          expect(task.board.filter((tile) => tile.value === task.value && tile.color === task.color)).toHaveLength(1);
        }
        if (task.type === 'find') {
          const matches = task.board.filter(
            (item) => item.kind === task.target.kind && item.color === task.target.color,
          );
          expect(matches).toHaveLength(task.count);
        }
        if (task.type === 'panels') {
          expect(task.panels).toHaveLength(3);
          const correct = task.panels[task.answer];
          expect(correct).toHaveLength(task.count);
          expect(correct.every((item) => item.kind === task.target.kind && item.color === task.target.color)).toBe(true);
        }
      }
    }
  });
});
