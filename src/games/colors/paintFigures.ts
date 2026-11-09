export interface PaintRegion {
  id: string;
  d: string;
}

export interface PaintFigure {
  id: string;
  name: string;
  regions: PaintRegion[];
}

function circle(cx: number, cy: number, r: number): string {
  return `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
}

const PETALS: PaintRegion[] = [-90, -18, 54, 126, 198].map((degrees, index) => {
  const radians = (degrees * Math.PI) / 180;
  return { id: `petal-${index}`, d: circle(200 + Math.cos(radians) * 80, 160 + Math.sin(radians) * 80, 56) };
});

export const FIGURES: PaintFigure[] = [
  {
    id: 'house',
    name: 'Casa',
    regions: [
      { id: 'wall', d: 'M 70 190 L 330 190 L 330 370 L 70 370 Z' },
      { id: 'door', d: 'M 176 370 L 176 280 Q 176 252 200 252 Q 224 252 224 280 L 224 370 Z' },
      { id: 'window-left', d: 'M 96 226 L 150 226 L 150 282 L 96 282 Z' },
      { id: 'window-right', d: 'M 250 226 L 304 226 L 304 282 L 250 282 Z' },
      { id: 'chimney', d: 'M 276 84 L 310 84 L 310 150 L 276 150 Z' },
      { id: 'roof', d: 'M 200 40 L 380 190 L 20 190 Z' },
    ],
  },
  {
    id: 'flower',
    name: 'Flor',
    regions: [
      ...PETALS,
      { id: 'stem', d: 'M 190 214 L 196 380 L 210 380 L 206 214 Z' },
      { id: 'leaf-left', d: 'M 194 300 Q 140 270 118 310 Q 160 336 194 300 Z' },
      { id: 'leaf-right', d: 'M 206 290 Q 260 262 282 300 Q 240 328 206 290 Z' },
      { id: 'center', d: circle(200, 160, 62) },
    ],
  },
  {
    id: 'fish',
    name: 'Pez',
    regions: [
      { id: 'tail', d: 'M 300 200 L 380 130 Q 360 200 380 270 Z' },
      { id: 'fin', d: 'M 150 118 Q 190 40 250 124 Z' },
      { id: 'body', d: 'M 60 200 A 130 90 0 1 0 320 200 A 130 90 0 1 0 60 200 Z' },
      { id: 'eye', d: circle(120, 180, 22) },
    ],
  },
  {
    id: 'car',
    name: 'Coche',
    regions: [
      { id: 'body', d: 'M 50 300 L 50 240 Q 50 214 80 210 L 330 210 Q 350 210 350 240 L 350 300 Z' },
      { id: 'cabin', d: 'M 120 210 L 165 140 L 265 140 L 300 210 Z' },
      { id: 'window-front', d: 'M 136 206 L 172 150 L 206 150 L 206 206 Z' },
      { id: 'window-back', d: 'M 220 206 L 220 150 L 258 150 L 280 206 Z' },
      { id: 'light', d: circle(336, 250, 14) },
      { id: 'wheel-left', d: circle(120, 300, 44) },
      { id: 'wheel-right', d: circle(290, 300, 44) },
    ],
  },
];
