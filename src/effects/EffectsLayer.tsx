import { useEffect, useState } from 'react';
import { onEffect, type Effect } from './effects';
import { cx, pick, randomBetween, randomInt, type CSSVars } from '../core/utils';
import './effects.css';

const CONFETTI_COLORS = ['#ff4b4b', '#ffc233', '#43c75b', '#3ba3ff', '#a66cff', '#ff7eb6', '#ff8c2b', '#2ec4b6'];
const CONFETTI_MS = 3600;
const BURST_MS = 900;

export function EffectsLayer() {
  const [active, setActive] = useState<Effect[]>([]);

  useEffect(() => {
    const timers = new Set<number>();
    const unsubscribe = onEffect((effect) => {
      setActive((current) => [...current.slice(-5), effect]);
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        setActive((current) => current.filter((item) => item.id !== effect.id));
      }, effect.kind === 'confetti' ? CONFETTI_MS : BURST_MS);
      timers.add(timer);
    });
    return () => {
      unsubscribe();
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return (
    <div className="effects" aria-hidden="true">
      {active.map((effect) =>
        effect.kind === 'confetti' ? (
          <Confetti key={effect.id} />
        ) : (
          <Burst key={effect.id} x={effect.x} y={effect.y} color={effect.color} />
        ),
      )}
    </div>
  );
}

function Confetti() {
  const [pieces] = useState(() =>
    Array.from({ length: 64 }, () => {
      const width = randomInt(9, 15);
      return {
        left: Math.random() * 100,
        drift: randomBetween(-160, 160),
        spin: randomInt(360, 1080),
        delay: randomBetween(0, 0.7),
        duration: randomBetween(2.6, 3.8),
        color: pick(CONFETTI_COLORS),
        width,
        height: Math.random() < 0.5 ? width : width * 1.7,
      };
    }),
  );

  return (
    <div className="confetti">
      {pieces.map((piece, index) => (
        <span
          key={index}
          className={cx('confetti__piece', piece.height === piece.width && 'is-round')}
          style={
            {
              left: `${piece.left}%`,
              width: piece.width,
              height: piece.height,
              background: piece.color,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              '--drift': `${piece.drift}px`,
              '--spin': `${piece.spin}deg`,
            } as CSSVars
          }
        />
      ))}
    </div>
  );
}

function Burst({ x, y, color }: { x: number; y: number; color: string }) {
  const [particles] = useState(() =>
    Array.from({ length: 12 }, (_, index) => {
      const angle = (index / 12) * Math.PI * 2 + randomBetween(-0.25, 0.25);
      const distance = randomBetween(70, 150);
      return {
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance,
        size: randomBetween(10, 18),
        star: index % 3 === 0,
      };
    }),
  );

  return (
    <div className="burst" style={{ left: x, top: y }}>
      {particles.map((particle, index) => (
        <span
          key={index}
          className={cx('burst__particle', particle.star && 'is-star')}
          style={
            {
              '--tx': `${particle.tx}px`,
              '--ty': `${particle.ty}px`,
              '--s': `${particle.size}px`,
              '--c': color,
            } as CSSVars
          }
        />
      ))}
    </div>
  );
}
