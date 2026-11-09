import { useEffect, type ReactNode } from 'react';
import { say } from '../audio';
import { sectionIntro } from '../audio/utterances';
import { GameShell } from '../components/GameShell';
import { useMati } from '../components/Mati';
import { HubCard } from '../components/ui';
import { navigate, ROUTES, type Route } from '../app/routes';
import './screens.css';

export interface HubEntry {
  label: string;
  art: ReactNode;
  from: string;
  to: string;
  route: Route;
}

interface HubProps {
  title: string;
  intro: 'numbers' | 'colors';
  entries: HubEntry[];
}

export function Hub({ title, intro, entries }: HubProps) {
  const mati = useMati('wave');

  useEffect(() => {
    say(sectionIntro(intro));
  }, [intro]);

  return (
    <GameShell title={title} onBack={() => navigate(ROUTES.home)} mati={mati}>
      <nav className="hub" aria-label={title}>
        {entries.map((entry, index) => (
          <HubCard
            key={entry.route}
            index={index}
            label={entry.label}
            art={entry.art}
            from={entry.from}
            to={entry.to}
            onClick={() => navigate(entry.route)}
          />
        ))}
      </nav>
    </GameShell>
  );
}
