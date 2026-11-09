import { useEffect, useState, type MouseEvent } from 'react';
import { say } from '../../audio';
import { findColorSpeech } from '../../audio/utterances';
import { GameShell } from '../../components/GameShell';
import { useMati } from '../../components/Mati';
import { ReplayIcon } from '../../components/icons';
import { IconButton } from '../../components/ui';
import { navigate, ROUTES } from '../../app/routes';
import { playMotion } from '../../core/motion';
import { useTimers } from '../../core/useTimers';
import { type CSSVars } from '../../core/utils';
import { getColor, type ColorId } from '../../data/colors';
import { celebrateSuccess, encourageRetry } from '../../feedback/feedback';
import { BalloonArt } from '../../illustrations/ObjectArt';
import { makeColorRound } from './colorRounds';
import './colors.css';

export function FindColor() {
  const mati = useMati();
  const timers = useTimers();
  const [correctTotal, setCorrectTotal] = useState(0);
  const [round, setRound] = useState(() => makeColorRound(0));
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => say(findColorSpeech(round.target)), 500);
    return () => window.clearTimeout(timer);
  }, [round.id, round.target]);

  const press = (color: ColorId, event: MouseEvent<HTMLButtonElement>) => {
    if (solved) return;
    if (color !== round.target) {
      playMotion(event.currentTarget, 'shake');
      mati.encourage();
      encourageRetry();
      timers.schedule('retry', 1800, () => say(findColorSpeech(round.target)));
      return;
    }
    playMotion(event.currentTarget, 'pop', 600);
    const total = correctTotal + 1;
    setSolved(true);
    setCorrectTotal(total);
    celebrateSuccess();
    mati.celebrate();
    timers.schedule('next', 2400, () => {
      setSolved(false);
      setRound(makeColorRound(total));
    });
  };

  return (
    <GameShell
      title="Encuentra el color"
      onBack={() => navigate(ROUTES.colors)}
      mati={mati}
      actions={
        <IconButton label="Repetir la pregunta" tone="warm" onClick={() => say(findColorSpeech(round.target))}>
          <ReplayIcon />
        </IconButton>
      }
    >
      <section className="balloons">
        {round.options.map((color, index) => (
          <button
            key={`${round.id}-${color}`}
            type="button"
            className="balloon"
            aria-label={getColor(color).name}
            style={{ '--i': index } as CSSVars}
            onClick={(event) => press(color, event)}
          >
            <BalloonArt color={getColor(color).hex} />
          </button>
        ))}
      </section>
    </GameShell>
  );
}
