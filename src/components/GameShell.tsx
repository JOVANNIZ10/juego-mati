import type { ReactNode } from 'react';
import { cx } from '../core/utils';
import type { MatiController } from './Mati';
import { Mati } from './Mati';
import { ArrowLeftIcon } from './icons';
import { IconButton, SoundToggle } from './ui';
import './shell.css';

interface GameShellProps {
  title: string;
  onBack: () => void;
  mati: MatiController;
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function GameShell({ title, onBack, mati, actions, className, children }: GameShellProps) {
  return (
    <div className={cx('shell', className)}>
      <header className="shell__header">
        <IconButton label="Volver" onClick={onBack}>
          <ArrowLeftIcon />
        </IconButton>
        <h1 className="shell__title">{title}</h1>
        <SoundToggle />
      </header>
      <main className="shell__main">{children}</main>
      <footer className="shell__companion">
        <Mati mood={mati.mood} onClick={mati.tap} className="shell__mati" />
        {actions && <div className="shell__actions">{actions}</div>}
      </footer>
    </div>
  );
}
