import type { ReactNode } from 'react';
import { bestGrid } from '../core/grid';
import { useMeasure } from '../core/useMeasure';
import { cx } from '../core/utils';

interface AutoGridProps {
  count: number;
  gap?: number;
  maxSize?: number;
  className?: string;
  children: (index: number) => ReactNode;
}

const PADDING = 8;

export function AutoGrid({ count, gap = 16, maxSize = 240, className, children }: AutoGridProps) {
  const [ref, { width, height }] = useMeasure<HTMLDivElement>();
  const layout = bestGrid(count, width - PADDING * 2, height - PADDING * 2, gap, maxSize);
  const innerWidth = layout.cols * layout.size + (layout.cols - 1) * gap;

  return (
    <div ref={ref} className={cx('auto-grid', className)}>
      <div className="auto-grid__inner" style={{ width: innerWidth, gap }}>
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="auto-grid__cell" style={{ width: layout.size, height: layout.size }}>
            {children(index)}
          </div>
        ))}
      </div>
    </div>
  );
}
