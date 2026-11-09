import { useCallback, useMemo, useState } from 'react';
import { playSfx, say } from '../audio';
import { chatter } from '../audio/utterances';
import { starPoints } from '../core/geometry';
import { cx } from '../core/utils';
import { useTimers } from '../core/useTimers';
import './Mati.css';

export type MatiMood = 'idle' | 'wave' | 'happy' | 'celebrate' | 'encourage' | 'surprise';

const MOOD_MS: Record<MatiMood, number> = {
  idle: 0,
  wave: 0,
  happy: 1400,
  celebrate: 1900,
  encourage: 1400,
  surprise: 1000,
};

export interface MatiController {
  mood: MatiMood;
  tap: () => void;
  happy: () => void;
  celebrate: () => void;
  encourage: () => void;
  surprise: () => void;
}

export function useMati(idleMood: MatiMood = 'idle'): MatiController {
  const [mood, setMood] = useState<MatiMood>(idleMood);
  const timers = useTimers();

  const show = useCallback(
    (next: MatiMood) => {
      setMood(next);
      const duration = MOOD_MS[next];
      if (duration > 0) timers.schedule('mati-mood', duration, () => setMood(idleMood));
      else timers.clear('mati-mood');
    },
    [idleMood, timers],
  );

  const tap = useCallback(() => {
    playSfx('boing');
    say(chatter());
    show('happy');
  }, [show]);

  return useMemo(
    () => ({
      mood,
      tap,
      happy: () => show('happy'),
      celebrate: () => show('celebrate'),
      encourage: () => show('encourage'),
      surprise: () => show('surprise'),
    }),
    [mood, tap, show],
  );
}

const BEAR = '#ffae5c';
const BEAR_DARK = '#f08a3c';
const MUZZLE = '#ffe3be';
const PINK = '#ff9ec4';
const INK = '#3b2a5a';
const OUTLINE = { stroke: INK, strokeWidth: 4 } as const;

interface MatiProps {
  mood?: MatiMood;
  onClick?: () => void;
  className?: string;
}

export function Mati({ mood = 'idle', onClick, className }: MatiProps) {
  return (
    <button type="button" aria-label="Mati" className={cx('mati', `mati--${mood}`, className)} onClick={onClick}>
      <svg viewBox="0 0 200 220" className="mati__svg" aria-hidden="true">
        <ellipse cx={100} cy={212} rx={58} ry={8} fill="rgba(59, 42, 90, 0.18)" />
        <ellipse cx={72} cy={196} rx={22} ry={14} fill={BEAR_DARK} {...OUTLINE} />
        <ellipse cx={128} cy={196} rx={22} ry={14} fill={BEAR_DARK} {...OUTLINE} />
        <ellipse cx={100} cy={150} rx={60} ry={52} fill={BEAR} {...OUTLINE} />
        <ellipse cx={100} cy={164} rx={30} ry={26} fill={MUZZLE} />
        <polygon points={starPoints(100, 166, 12, 5.5, 5)} fill="#ffd23f" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
        <circle cx={50} cy={36} r={22} fill={BEAR} {...OUTLINE} />
        <circle cx={150} cy={36} r={22} fill={BEAR} {...OUTLINE} />
        <circle cx={50} cy={38} r={12} fill={PINK} />
        <circle cx={150} cy={38} r={12} fill={PINK} />
        <circle cx={100} cy={84} r={62} fill={BEAR} {...OUTLINE} />
        <ellipse cx={100} cy={112} rx={32} ry={24} fill={MUZZLE} />
        <ellipse cx={58} cy={106} rx={9} ry={6} fill="#ff6fa8" opacity={0.5} />
        <ellipse cx={142} cy={106} rx={9} ry={6} fill="#ff6fa8" opacity={0.5} />
        <g className="mati__arm mati__arm--left">
          <ellipse cx={50} cy={152} rx={16} ry={26} fill={BEAR} {...OUTLINE} />
        </g>
        <g className="mati__arm mati__arm--right">
          <ellipse cx={150} cy={152} rx={16} ry={26} fill={BEAR} {...OUTLINE} />
        </g>
        <g className="mati__eyes mati__eyes--open">
          <g className="mati__eye">
            <ellipse cx={76} cy={84} rx={10} ry={13} fill={INK} />
            <circle cx={79} cy={78} r={4} fill="#fff" />
            <circle cx={72} cy={89} r={2} fill="#fff" />
          </g>
          <g className="mati__eye">
            <ellipse cx={124} cy={84} rx={10} ry={13} fill={INK} />
            <circle cx={127} cy={78} r={4} fill="#fff" />
            <circle cx={120} cy={89} r={2} fill="#fff" />
          </g>
        </g>
        <g className="mati__eyes mati__eyes--happy" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round">
          <path d="M65 86 Q76 72 87 86" />
          <path d="M113 86 Q124 72 135 86" />
        </g>
        <ellipse cx={100} cy={100} rx={10} ry={7} fill={INK} />
        <ellipse cx={97} cy={98} rx={3} ry={2} fill="#fff" opacity={0.7} />
        <path
          className="mati__mouth mati__mouth--smile"
          d="M88 118 Q100 130 112 118"
          fill="none"
          stroke={INK}
          strokeWidth={4}
          strokeLinecap="round"
        />
        <g className="mati__mouth mati__mouth--open">
          <path d="M84 116 Q100 114 116 116 Q112 138 100 138 Q88 138 84 116 Z" fill={INK} />
          <ellipse cx={100} cy={132} rx={8} ry={4.5} fill="#ff6fa8" />
        </g>
        <ellipse className="mati__mouth mati__mouth--o" cx={100} cy={124} rx={7} ry={9} fill={INK} />
      </svg>
    </button>
  );
}
