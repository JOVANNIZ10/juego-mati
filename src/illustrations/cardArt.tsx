import type { ReactNode } from 'react';
import { starPoints } from '../core/geometry';
import { BalloonShape, ObjectShape } from './ObjectArt';

const INK = '#3b2a5a';

function CardSvg({ children }: { children: ReactNode }) {
  return (
    <svg className="card-art" viewBox="0 0 120 120" aria-hidden="true">
      {children}
    </svg>
  );
}

function Tile({ x, y, size, color, digit }: { x: number; y: number; size: number; color: string; digit: string }) {
  return (
    <g>
      <rect x={x} y={y} width={size} height={size} rx={size * 0.22} fill={color} stroke={INK} strokeWidth={3} />
      <rect x={x + 4} y={y + 4} width={size - 8} height={size * 0.38} rx={size * 0.16} fill="#fff" opacity={0.25} />
      <text
        x={x + size / 2}
        y={y + size / 2 + size * 0.04}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.62}
        fontWeight={700}
        fill="#fff"
        stroke={INK}
        strokeWidth={size * 0.04}
        paintOrder="stroke"
      >
        {digit}
      </text>
    </g>
  );
}

function Dot({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color} stroke={INK} strokeWidth={3} />
      <circle cx={cx - r * 0.35} cy={cy - r * 0.35} r={r * 0.22} fill="#fff" opacity={0.7} />
    </g>
  );
}

function Sparkle({ x, y, s }: { x: number; y: number; s: number }) {
  const d = `M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s} Z`;
  return <path d={d} fill="#fff" stroke={INK} strokeWidth={2} strokeLinejoin="round" />;
}

export function NumbersArt() {
  return (
    <CardSvg>
      <Tile x={8} y={62} size={34} color="#ff4b4b" digit="1" />
      <Tile x={43} y={38} size={34} color="#43c75b" digit="2" />
      <Tile x={78} y={14} size={34} color="#3ba3ff" digit="3" />
    </CardSvg>
  );
}

export function ColorsArt() {
  return (
    <CardSvg>
      <Dot cx={36} cy={36} r={22} color="#ff4b4b" />
      <Dot cx={84} cy={36} r={22} color="#ffd23f" />
      <Dot cx={36} cy={84} r={22} color="#3ba3ff" />
      <Dot cx={84} cy={84} r={22} color="#43c75b" />
    </CardSvg>
  );
}

export function CombinedArt() {
  return (
    <CardSvg>
      <g transform="translate(14 14) scale(0.84)">
        <ObjectShape kind="star" color="#ffd23f" />
      </g>
      <Sparkle x={104} y={18} s={10} />
      <Sparkle x={16} y={104} s={7} />
      <Sparkle x={106} y={96} s={6} />
    </CardSvg>
  );
}

export function LearnArt() {
  return (
    <CardSvg>
      <text
        x={44}
        y={64}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={80}
        fontWeight={700}
        fill="#a66cff"
        stroke={INK}
        strokeWidth={4}
        paintOrder="stroke"
      >
        7
      </text>
      <g transform="translate(76 14) scale(0.2)">
        <ObjectShape kind="star" color="#ffd23f" />
      </g>
      <g transform="translate(94 46) scale(0.2)">
        <ObjectShape kind="star" color="#ff8c2b" />
      </g>
      <g transform="translate(78 80) scale(0.2)">
        <ObjectShape kind="star" color="#43c75b" />
      </g>
    </CardSvg>
  );
}

export function CountArt() {
  return (
    <CardSvg>
      <g transform="translate(6 6) scale(0.5)">
        <ObjectShape kind="apple" color="#ff4b4b" />
      </g>
      <g transform="translate(64 6) scale(0.5)">
        <ObjectShape kind="ball" color="#3ba3ff" />
      </g>
      <g transform="translate(6 64) scale(0.5)">
        <ObjectShape kind="star" color="#ffd23f" />
      </g>
      <g transform="translate(64 64) scale(0.5)">
        <ObjectShape kind="fish" color="#43c75b" />
      </g>
    </CardSvg>
  );
}

export function FindArt() {
  return (
    <CardSvg>
      <line x1={80} y1={80} x2={106} y2={106} stroke={INK} strokeWidth={14} strokeLinecap="round" />
      <circle cx={52} cy={52} r={38} fill="#e8f7ff" stroke={INK} strokeWidth={5} />
      <text
        x={52}
        y={56}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={56}
        fontWeight={700}
        fill="#ff7eb6"
        stroke={INK}
        strokeWidth={3}
        paintOrder="stroke"
      >
        9
      </text>
    </CardSvg>
  );
}

export function ExplodeArt() {
  return (
    <CardSvg>
      <polygon points={starPoints(60, 62, 54, 38, 12)} fill="#ffc233" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <text
        x={60}
        y={62}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={30}
        fontWeight={700}
        fill="#ff4b4b"
        stroke="#fff"
        strokeWidth={4}
        paintOrder="stroke"
      >
        18
      </text>
    </CardSvg>
  );
}

export function BalloonsArt() {
  return (
    <CardSvg>
      <g transform="translate(2 22) scale(0.5)">
        <BalloonShape color="#ff4b4b" />
      </g>
      <g transform="translate(35 4) scale(0.5)">
        <BalloonShape color="#ffc233" />
      </g>
      <g transform="translate(68 22) scale(0.5)">
        <BalloonShape color="#3ba3ff" />
      </g>
    </CardSvg>
  );
}

export function ObjectsArt() {
  return (
    <CardSvg>
      <g transform="translate(4 8) scale(0.5)">
        <ObjectShape kind="car" color="#3ba3ff" />
      </g>
      <g transform="translate(62 6) scale(0.5)">
        <ObjectShape kind="banana" color="#ffd23f" />
      </g>
      <g transform="translate(34 60) scale(0.5)">
        <ObjectShape kind="frog" color="#43c75b" />
      </g>
    </CardSvg>
  );
}

export function FactoryArt() {
  return (
    <CardSvg>
      <path
        d="M60 22 C92 16 112 40 108 66 C104 94 80 104 62 98 C54 96 50 90 56 84 C62 78 52 70 44 74 C30 82 14 66 16 48 C18 30 40 26 60 22 Z"
        fill="#fff8e1"
        stroke={INK}
        strokeWidth={3}
      />
      <circle cx={36} cy={44} r={7} fill="#ff4b4b" stroke={INK} strokeWidth={2} />
      <circle cx={56} cy={34} r={7} fill="#ffc233" stroke={INK} strokeWidth={2} />
      <circle cx={80} cy={40} r={7} fill="#43c75b" stroke={INK} strokeWidth={2} />
      <circle cx={40} cy={66} r={7} fill="#3ba3ff" stroke={INK} strokeWidth={2} />
      <circle cx={72} cy={72} r={7} fill="#a66cff" stroke={INK} strokeWidth={2} />
      <g transform="rotate(35 92 40)">
        <rect x={86} y={6} width={12} height={58} rx={6} fill="#ff7eb6" stroke={INK} strokeWidth={3} />
        <path d="M86 64 Q92 84 98 64 Z" fill="#ffc233" stroke={INK} strokeWidth={3} />
      </g>
    </CardSvg>
  );
}
