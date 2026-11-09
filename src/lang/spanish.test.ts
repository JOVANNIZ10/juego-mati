import { describe, expect, it } from 'vitest';
import { getObject } from '../data/objects';
import { colorAdjective, countQuestion, describeGroup, numberWord } from './spanish';

describe('gramática en español', () => {
  it('convierte los números del 1 al 20', () => {
    expect(numberWord(1)).toBe('uno');
    expect(numberWord(16)).toBe('dieciséis');
    expect(numberWord(20)).toBe('veinte');
  });

  it('concierta los colores con el sustantivo', () => {
    expect(colorAdjective('purple', 'f', true)).toBe('moradas');
    expect(colorAdjective('red', 'm', false)).toBe('rojo');
    expect(colorAdjective('blue', 'f', true)).toBe('azules');
  });

  it('describe grupos con determinante, número y color', () => {
    expect(describeGroup(3, getObject('star'), 'yellow')).toBe('tres estrellas amarillas');
    expect(describeGroup(1, getObject('car'), 'blue')).toBe('un coche azul');
    expect(describeGroup(1, getObject('star'), 'yellow')).toBe('una estrella amarilla');
    expect(describeGroup(2, getObject('car'), 'blue')).toBe('dos coches azules');
  });

  it('pregunta por la cantidad con el género correcto', () => {
    expect(countQuestion(getObject('star'))).toBe('¿Cuántas estrellas hay?');
    expect(countQuestion(getObject('dino'))).toBe('¿Cuántos dinosaurios hay?');
  });
});
