export type ColorId = 'red' | 'blue' | 'yellow' | 'green' | 'orange' | 'pink' | 'purple' | 'white' | 'black' | 'brown';

export interface ColorInfo {
  id: ColorId;
  name: string;
  hex: string;
  /** Formas del adjetivo: masculino, femenino, masculino plural y femenino plural. */
  forms: readonly [string, string, string, string];
}

export const COLORS: readonly ColorInfo[] = [
  { id: 'red', name: 'rojo', hex: '#ff4b4b', forms: ['rojo', 'roja', 'rojos', 'rojas'] },
  { id: 'blue', name: 'azul', hex: '#3ba3ff', forms: ['azul', 'azul', 'azules', 'azules'] },
  { id: 'yellow', name: 'amarillo', hex: '#ffd23f', forms: ['amarillo', 'amarilla', 'amarillos', 'amarillas'] },
  { id: 'green', name: 'verde', hex: '#43c75b', forms: ['verde', 'verde', 'verdes', 'verdes'] },
  { id: 'orange', name: 'naranja', hex: '#ff8c2b', forms: ['naranja', 'naranja', 'naranja', 'naranja'] },
  { id: 'pink', name: 'rosa', hex: '#ff7eb6', forms: ['rosa', 'rosa', 'rosa', 'rosa'] },
  { id: 'purple', name: 'morado', hex: '#a66cff', forms: ['morado', 'morada', 'morados', 'moradas'] },
  { id: 'white', name: 'blanco', hex: '#ffffff', forms: ['blanco', 'blanca', 'blancos', 'blancas'] },
  { id: 'black', name: 'negro', hex: '#2d2a3e', forms: ['negro', 'negra', 'negros', 'negras'] },
  { id: 'brown', name: 'marrón', hex: '#a0673b', forms: ['marrón', 'marrón', 'marrones', 'marrones'] },
];

export const COLOR_IDS: readonly ColorId[] = COLORS.map((color) => color.id);

const BY_ID = Object.fromEntries(COLORS.map((color) => [color.id, color])) as Record<ColorId, ColorInfo>;

export function getColor(id: ColorId): ColorInfo {
  return BY_ID[id];
}
