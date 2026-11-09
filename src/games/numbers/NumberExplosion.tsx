import { useState, type MouseEvent } from 'react';
import { playSfx, say } from '../../audio';
import { numberSpeech } from '../../audio/utterances';
import { GameShell } from '../../components/GameShell';
import { useMati } from '../../components/Mati';
import { navigate, ROUTES } from '../../app/routes';
import { isLight } from '../../core/color';
import { useTimers } from '../../core/useTimers';
import { clamp, cx, nextId, pick, randomBetween, randomInt, type CSSVars } from '../../core/utils';
import { MAX_NUMBER, MIN_NUMBER, NUMBER_PALETTE } from '../../data/numbers';
import { burstAt } from '../../effects/effects';
import './numbers.css';

interface Bubble {
  id: number;
  value: number;
  x: number;
  y: number;
  color: string;
  duration: number;
  delay: number;
  popping: boolean;
}

const MIN_GAP_PX = 150;
const INK = '#3b2a5a';

function spawnBubble(others: Bubble[]): Bubble {
  let x = 50;
  let y = 50;
  for (let attempt = 0; attempt < 30; attempt++) {
    x = randomBetween(8, 92);
    y = randomBetween(12, 84);
    const clear = others.every((other) => {
      const dx = ((other.x - x) / 100) * window.innerWidth;
      const dy = ((other.y - y) / 100) * window.innerHeight;
      return Math.hypot(dx, dy) > MIN_GAP_PX;
    });
    if (clear) break;
  }
  return {
    id: nextId(),
    value: randomInt(MIN_NUMBER, MAX_NUMBER),
    x,
    y,
    color: pick(NUMBER_PALETTE),
    duration: randomBetween(3.5, 6.5),
    delay: -randomBetween(0, 5),
    popping: false,
  };
}

function createField(): Bubble[] {
  const count = Math.round(clamp((window.innerWidth * window.innerHeight) / 70000, 7, 13));
  const field: Bubble[] = [];
  for (let i = 0; i < count; i++) field.push(spawnBubble(field));
  return field;
}

function replaceBubble(field: Bubble[], id: number): Bubble[] {
  const fresh = spawnBubble(field.filter((bubble) => bubble.id !== id));
  return field.map((bubble) => (bubble.id === id ? fresh : bubble));
}

export function NumberExplosion() {
  const mati = useMati();
  const timers = useTimers();
  const [bubbles, setBubbles] = useState<Bubble[]>(createField);

  const pop = (bubble: Bubble, event: MouseEvent<HTMLButtonElement>) => {
    if (bubble.popping) return;
    burstAt(event.clientX, event.clientY, bubble.color);
    playSfx(Math.random() < 0.5 ? 'bloop' : 'squeak');
    say(numberSpeech(bubble.value));
    mati.happy();
    setBubbles((field) => field.map((item) => (item.id === bubble.id ? { ...item, popping: true } : item)));
    timers.schedule(`bubble-${bubble.id}`, 650, () => setBubbles((field) => replaceBubble(field, bubble.id)));
  };

  return (
    <GameShell title="Explosión de números" onBack={() => navigate(ROUTES.numbers)} mati={mati}>
      <section className="explosion">
        {bubbles.map((bubble) => {
          const ink = isLight(bubble.color) ? INK : '#ffffff';
          return (
            <div key={bubble.id} className="explosion__slot" style={{ left: `${bubble.x}%`, top: `${bubble.y}%` }}>
              <button
                type="button"
                className={cx('bubble', bubble.popping && 'is-popping')}
                style={{ '--bubble': bubble.color, '--bubble-ink': ink } as CSSVars}
                onClick={(event) => pop(bubble, event)}
                aria-label={`Número ${bubble.value}`}
              >
                <span
                  className="bubble__text"
                  style={{ animationDuration: `${bubble.duration}s`, animationDelay: `${bubble.delay}s` }}
                >
                  {bubble.value}
                </span>
              </button>
            </div>
          );
        })}
      </section>
    </GameShell>
  );
}
