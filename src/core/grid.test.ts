import { describe, expect, it } from 'vitest';
import { bestGrid } from './grid';

describe('bestGrid', () => {
  it('cabe siempre dentro de la caja', () => {
    for (let count = 1; count <= 20; count++) {
      const layout = bestGrid(count, 800, 500, 12);
      expect(layout.cols * layout.rows).toBeGreaterThanOrEqual(count);
      expect(layout.cols * layout.size + (layout.cols - 1) * 12).toBeLessThanOrEqual(800 + 1e-6);
      expect(layout.rows * layout.size + (layout.rows - 1) * 12).toBeLessThanOrEqual(500 + 1e-6);
    }
  });

  it('usa más columnas en cajas anchas y más filas en cajas altas', () => {
    expect(bestGrid(6, 1000, 300, 10).cols).toBeGreaterThan(3);
    expect(bestGrid(6, 300, 1000, 10).cols).toBeLessThan(3);
  });

  it('respeta el tamaño máximo', () => {
    expect(bestGrid(2, 1000, 1000, 0, 100).size).toBe(100);
  });
});
