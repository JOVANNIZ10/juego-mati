export function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '');
  const channel = (start: number) => parseInt(value.slice(start, start + 2), 16);
  return [channel(0), channel(2), channel(4)];
}

export function shade(hex: string, percent: number): string {
  const [r, g, b] = hexToRgb(hex);
  const target = percent < 0 ? 0 : 255;
  const amount = Math.abs(percent) / 100;
  const mix = (channel: number) => Math.round(channel + (target - channel) * amount);
  return `#${[mix(r), mix(g), mix(b)].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

export function isLight(hex: string): boolean {
  const [r, g, b] = hexToRgb(hex);
  return 0.299 * r + 0.587 * g + 0.114 * b > 165;
}
