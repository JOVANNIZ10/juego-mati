import type { ComponentType } from 'react';
import type { ObjectKind } from '../data/objects';
import { shade } from '../core/color';
import { starPoints } from '../core/geometry';
import { cx } from '../core/utils';

const INK = '#3b2a5a';
const STROKE = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round', strokeLinecap: 'round' } as const;
const LEAF = '#43c75b';
const STEM = '#8b5a2b';

interface ArtProps {
  color: string;
}

function Face({ x = 50, y = 56, scale = 1 }: { x?: number; y?: number; scale?: number }) {
  const s = scale;
  return (
    <g>
      <ellipse cx={x - 11 * s} cy={y} rx={3.6 * s} ry={4.6 * s} fill={INK} />
      <ellipse cx={x + 11 * s} cy={y} rx={3.6 * s} ry={4.6 * s} fill={INK} />
      <circle cx={x - 10 * s} cy={y - 1.8 * s} r={1.2 * s} fill="#fff" />
      <circle cx={x + 12 * s} cy={y - 1.8 * s} r={1.2 * s} fill="#fff" />
      <path
        d={`M ${x - 6 * s} ${y + 7 * s} Q ${x} ${y + 13 * s} ${x + 6 * s} ${y + 7 * s}`}
        fill="none"
        stroke={INK}
        strokeWidth={2.6 * s}
        strokeLinecap="round"
      />
      <ellipse cx={x - 19 * s} cy={y + 7 * s} rx={4 * s} ry={2.6 * s} fill="#ff7eb6" opacity={0.7} />
      <ellipse cx={x + 19 * s} cy={y + 7 * s} rx={4 * s} ry={2.6 * s} fill="#ff7eb6" opacity={0.7} />
    </g>
  );
}

function StarArt({ color }: ArtProps) {
  return (
    <>
      <polygon points={starPoints(50, 52, 46, 22, 5)} fill={color} {...STROKE} />
      <Face y={54} />
    </>
  );
}

function AppleArt({ color }: ArtProps) {
  return (
    <>
      <path
        d="M50 34 C36 22 12 26 12 56 C12 82 30 94 44 88 C47 87 53 87 56 88 C70 94 88 82 88 56 C88 26 64 22 50 34 Z"
        fill={color}
        {...STROKE}
      />
      <path d="M50 34 Q50 22 56 14" fill="none" stroke={STEM} strokeWidth={4} strokeLinecap="round" />
      <path d="M54 26 C56 12 70 8 78 12 C74 24 64 30 54 26 Z" fill={LEAF} {...STROKE} strokeWidth={2.5} />
      <ellipse cx={28} cy={50} rx={5} ry={9} fill="#fff" opacity={0.45} transform="rotate(20 28 50)" />
      <Face y={60} />
    </>
  );
}

function BallArt({ color }: ArtProps) {
  return (
    <>
      <circle cx={50} cy={50} r={40} fill={color} {...STROKE} />
      <path d="M14 40 Q50 52 86 40" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.85} />
      <circle cx={34} cy={28} r={6} fill="#fff" opacity={0.6} />
      <Face y={64} />
    </>
  );
}

function DinoArt({ color }: ArtProps) {
  const dark = shade(color, -22);
  return (
    <>
      <path d="M14 62 Q2 50 10 36 Q16 48 26 52 Z" fill={dark} {...STROKE} />
      <rect x={30} y={70} width={12} height={20} rx={6} fill={dark} {...STROKE} />
      <rect x={54} y={70} width={12} height={20} rx={6} fill={dark} {...STROKE} />
      <path d="M24 46 L30 28 L40 42 L46 24 L54 40 L62 30 L66 44 Z" fill={dark} {...STROKE} />
      <ellipse cx={46} cy={60} rx={34} ry={24} fill={color} {...STROKE} />
      <circle cx={70} cy={38} r={20} fill={color} {...STROKE} />
      <Face x={72} y={38} scale={0.62} />
    </>
  );
}

function FlowerArt({ color }: ArtProps) {
  const petals = [-90, -18, 54, 126, 198].map((degrees) => {
    const radians = (degrees * Math.PI) / 180;
    return (
      <circle
        key={degrees}
        cx={50 + Math.cos(radians) * 22}
        cy={40 + Math.sin(radians) * 22}
        r={16}
        fill={color}
        {...STROKE}
      />
    );
  });
  return (
    <>
      <path d="M50 56 Q46 78 50 96" fill="none" stroke={LEAF} strokeWidth={6} strokeLinecap="round" />
      <ellipse cx={36} cy={80} rx={11} ry={6} fill={LEAF} {...STROKE} strokeWidth={2.5} transform="rotate(-25 36 80)" />
      <ellipse cx={62} cy={74} rx={11} ry={6} fill={LEAF} {...STROKE} strokeWidth={2.5} transform="rotate(25 62 74)" />
      {petals}
      <circle cx={50} cy={40} r={15} fill="#ffd23f" {...STROKE} />
      <Face x={50} y={41} scale={0.45} />
    </>
  );
}

function FishArt({ color }: ArtProps) {
  const dark = shade(color, -20);
  return (
    <>
      <path d="M78 50 L94 30 Q90 50 94 70 Z" fill={dark} {...STROKE} />
      <path d="M36 32 Q46 12 60 32 Z" fill={dark} {...STROKE} />
      <ellipse cx={46} cy={50} rx={34} ry={24} fill={color} {...STROKE} />
      <Face x={38} y={46} scale={0.8} />
    </>
  );
}

function HeartArt({ color }: ArtProps) {
  return (
    <>
      <path
        d="M50 88 C20 68 6 50 14 32 C22 14 44 14 50 30 C56 14 78 14 86 32 C94 50 80 68 50 88 Z"
        fill={color}
        {...STROKE}
      />
      <ellipse cx={28} cy={36} rx={6} ry={4} fill="#fff" opacity={0.5} transform="rotate(-30 28 36)" />
      <Face y={52} />
    </>
  );
}

function CarArt({ color }: ArtProps) {
  return (
    <>
      <rect x={8} y={40} width={84} height={30} rx={12} fill={color} {...STROKE} />
      <path d="M26 40 L38 22 H66 L78 40 Z" fill={color} {...STROKE} />
      <path d="M34 39 L43 26 H52 V39 Z" fill="#cdeeff" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M57 39 V26 H64 L74 39 Z" fill="#cdeeff" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      <circle cx={28} cy={72} r={11} fill={INK} />
      <circle cx={74} cy={72} r={11} fill={INK} />
      <circle cx={28} cy={72} r={4} fill="#e6dcf5" />
      <circle cx={74} cy={72} r={4} fill="#e6dcf5" />
      <circle cx={88} cy={52} r={4} fill="#ffd23f" stroke={INK} strokeWidth={2} />
    </>
  );
}

function BananaArt({ color }: ArtProps) {
  return (
    <>
      <path d="M22 26 Q16 72 66 80" fill="none" stroke={INK} strokeWidth={26} strokeLinecap="round" />
      <path d="M22 26 Q16 72 66 80" fill="none" stroke={color} strokeWidth={20} strokeLinecap="round" />
      <path d="M22 26 L18 14" stroke={STEM} strokeWidth={6} strokeLinecap="round" />
      <path d="M66 80 L72 84" stroke={STEM} strokeWidth={5} strokeLinecap="round" />
    </>
  );
}

function FrogArt({ color }: ArtProps) {
  const dark = shade(color, -15);
  return (
    <>
      <ellipse cx={20} cy={80} rx={11} ry={7} fill={dark} {...STROKE} />
      <ellipse cx={80} cy={80} rx={11} ry={7} fill={dark} {...STROKE} />
      <ellipse cx={50} cy={62} rx={38} ry={28} fill={color} {...STROKE} />
      <circle cx={30} cy={36} r={15} fill={color} {...STROKE} />
      <circle cx={70} cy={36} r={15} fill={color} {...STROKE} />
      <circle cx={30} cy={36} r={9} fill="#fff" />
      <circle cx={70} cy={36} r={9} fill="#fff" />
      <circle cx={31} cy={37} r={4.5} fill={INK} />
      <circle cx={69} cy={37} r={4.5} fill={INK} />
      <path d="M32 66 Q50 82 68 66" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
      <ellipse cx={24} cy={64} rx={4} ry={2.5} fill="#ff7eb6" opacity={0.6} />
      <ellipse cx={76} cy={64} rx={4} ry={2.5} fill="#ff7eb6" opacity={0.6} />
    </>
  );
}

function OrangeArt({ color }: ArtProps) {
  return (
    <>
      <circle cx={50} cy={56} r={38} fill={color} {...STROKE} />
      <path d="M50 20 Q56 6 72 8 Q66 22 50 20 Z" fill={LEAF} {...STROKE} strokeWidth={2.5} />
      <path d="M50 20 Q50 12 52 6" fill="none" stroke={STEM} strokeWidth={3} strokeLinecap="round" />
      <ellipse cx={28} cy={42} rx={6} ry={10} fill="#fff" opacity={0.35} transform="rotate(25 28 42)" />
      <Face y={60} />
    </>
  );
}

function CloudArt({ color }: ArtProps) {
  const shapes = (
    <>
      <circle cx={34} cy={60} r={18} />
      <circle cx={52} cy={46} r={24} />
      <circle cx={70} cy={60} r={18} />
      <rect x={24} y={58} width={56} height={22} rx={11} />
    </>
  );
  return (
    <>
      <g fill={INK} stroke={INK} strokeWidth={8} strokeLinejoin="round">
        {shapes}
      </g>
      <g fill={color}>{shapes}</g>
      <Face y={62} />
    </>
  );
}

function CookieArt({ color }: ArtProps) {
  const chips: Array<[number, number, number]> = [
    [30, 36, 4.5],
    [64, 28, 3.6],
    [40, 66, 4.8],
    [70, 62, 4],
    [52, 48, 3.2],
    [22, 56, 3],
  ];
  return (
    <>
      <circle cx={50} cy={50} r={40} fill={color} {...STROKE} />
      {chips.map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#5a3a22" />
      ))}
    </>
  );
}

function CatArt({ color }: ArtProps) {
  return (
    <>
      <path d="M18 46 L20 12 L42 32 Z" fill={color} {...STROKE} />
      <path d="M82 46 L80 12 L58 32 Z" fill={color} {...STROKE} />
      <circle cx={50} cy={58} r={36} fill={color} {...STROKE} />
      <ellipse cx={37} cy={54} rx={5} ry={6.5} fill="#ffd23f" />
      <ellipse cx={63} cy={54} rx={5} ry={6.5} fill="#ffd23f" />
      <circle cx={37} cy={55} r={3} fill={INK} />
      <circle cx={63} cy={55} r={3} fill={INK} />
      <path d="M46 66 L54 66 L50 71 Z" fill="#ff7eb6" stroke={INK} strokeWidth={1.5} />
      <path d="M50 71 Q46 77 40 75 M50 71 Q54 77 60 75" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" />
      <path d="M20 66 L6 62 M20 72 L6 74 M80 66 L94 62 M80 72 L94 74" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
    </>
  );
}

const SHAPES: Record<ObjectKind, ComponentType<ArtProps>> = {
  star: StarArt,
  apple: AppleArt,
  ball: BallArt,
  dino: DinoArt,
  flower: FlowerArt,
  fish: FishArt,
  heart: HeartArt,
  car: CarArt,
  banana: BananaArt,
  frog: FrogArt,
  orange: OrangeArt,
  cloud: CloudArt,
  cookie: CookieArt,
  cat: CatArt,
};

export function ObjectShape({ kind, color }: { kind: ObjectKind; color: string }) {
  const Shape = SHAPES[kind];
  return <Shape color={color} />;
}

export function ObjectArt({ kind, color, className }: { kind: ObjectKind; color: string; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cx('object-art', className)} aria-hidden="true">
      <ObjectShape kind={kind} color={color} />
    </svg>
  );
}

export function BalloonShape({ color }: { color: string }) {
  return (
    <>
      <path d="M50 104 Q44 116 50 128" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M44 104 L50 96 L56 104 Z" fill={shade(color, -10)} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      <ellipse cx={50} cy={50} rx={42} ry={50} fill={color} stroke={INK} strokeWidth={3} />
      <ellipse cx={32} cy={34} rx={7} ry={12} fill="#fff" opacity={0.5} transform="rotate(20 32 34)" />
    </>
  );
}

export function BalloonArt({ color, className }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 100 130" className={cx('balloon-art', className)} aria-hidden="true">
      <BalloonShape color={color} />
    </svg>
  );
}
