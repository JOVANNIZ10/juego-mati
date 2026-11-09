export interface GridLayout {
  cols: number;
  rows: number;
  size: number;
}

export function bestGrid(count: number, width: number, height: number, gap: number, maxSize = Infinity): GridLayout {
  let best: GridLayout = { cols: 1, rows: count, size: 0 };
  if (count <= 0 || width <= 0 || height <= 0) return best;
  for (let cols = 1; cols <= count; cols++) {
    const rows = Math.ceil(count / cols);
    const byWidth = (width - gap * (cols - 1)) / cols;
    const byHeight = (height - gap * (rows - 1)) / rows;
    const size = Math.min(byWidth, byHeight, maxSize);
    if (size > best.size) best = { cols, rows, size };
  }
  return best;
}
