import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { playSfx, setSoundEnabled, isSoundEnabled, useSoundEnabled } from '../audio';
import { playMotion } from '../core/motion';
import { cx, type CSSVars } from '../core/utils';
import { MuteIcon, VolumeIcon } from './icons';
import './ui.css';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  tone?: 'light' | 'warm' | 'cool';
}

export function IconButton({ label, tone = 'light', className, children, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cx('icon-btn', `icon-btn--${tone}`, className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export function SoundToggle() {
  const enabled = useSoundEnabled();

  const toggle = () => {
    const next = !isSoundEnabled();
    setSoundEnabled(next);
    if (next) playSfx('bell');
  };

  return (
    <IconButton label={enabled ? 'Silenciar sonido' : 'Activar sonido'} className="sound-toggle" onClick={toggle}>
      {enabled ? <VolumeIcon /> : <MuteIcon />}
    </IconButton>
  );
}

interface HubCardProps {
  label: string;
  art: ReactNode;
  from: string;
  to: string;
  ink?: string;
  index?: number;
  onClick: () => void;
}

export function HubCard({ label, art, from, to, ink = '#fff', index = 0, onClick }: HubCardProps) {
  return (
    <button
      type="button"
      className="hub-card"
      onClick={() => {
        playSfx('tap');
        onClick();
      }}
      style={
        {
          '--card-from': from,
          '--card-to': to,
          '--card-ink': ink,
          '--card-delay': `${index * 0.4}s`,
        } as CSSVars
      }
    >
      <span className="hub-card__art">{art}</span>
      <span className="hub-card__label">{label}</span>
    </button>
  );
}

interface AnswerTileProps {
  children: ReactNode;
  label: string;
  correct: boolean;
  onPress: (correct: boolean) => void;
  background?: string;
  ink?: string;
  hint?: boolean;
  disabled?: boolean;
}

export function AnswerTile({
  children,
  label,
  correct,
  onPress,
  background = '#ffffff',
  ink = '#3b2a5a',
  hint = false,
  disabled = false,
}: AnswerTileProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      className={cx('answer-tile', hint && 'is-hint')}
      style={{ '--tile-bg': background, '--tile-ink': ink } as CSSVars}
      onClick={(event) => {
        playMotion(event.currentTarget, correct ? 'pop' : 'shake');
        onPress(correct);
      }}
    >
      {children}
    </button>
  );
}
