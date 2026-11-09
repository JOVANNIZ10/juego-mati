import { cx, type CSSVars } from '../core/utils';
import './background.css';

const DECOR: Array<{ kind: 'star' | 'bubble' | 'cloud'; top: string; left: string; size: number; delay: number }> = [
  { kind: 'star', top: '7%', left: '8%', size: 46, delay: 0 },
  { kind: 'bubble', top: '16%', left: '84%', size: 90, delay: 1.2 },
  { kind: 'cloud', top: '9%', left: '58%', size: 150, delay: 0.6 },
  { kind: 'star', top: '64%', left: '90%', size: 34, delay: 2 },
  { kind: 'bubble', top: '78%', left: '6%', size: 110, delay: 0.4 },
  { kind: 'cloud', top: '86%', left: '56%', size: 130, delay: 1.8 },
  { kind: 'star', top: '40%', left: '3%', size: 28, delay: 2.6 },
  { kind: 'bubble', top: '44%', left: '48%', size: 56, delay: 3 },
];

export function Background() {
  return (
    <div className="background" aria-hidden="true">
      {DECOR.map((item, index) => (
        <span
          key={index}
          className={cx('deco', `deco--${item.kind}`)}
          style={
            {
              top: item.top,
              left: item.left,
              width: item.size,
              height: item.size,
              '--deco-delay': `${item.delay}s`,
            } as CSSVars
          }
        />
      ))}
    </div>
  );
}
