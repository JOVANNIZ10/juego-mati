import { useEffect, useState, type MouseEvent } from 'react';
import { say } from '../../audio';
import { colorQuestionSpeech, praiseWithColorObject } from '../../audio/utterances';
import { GameShell } from '../../components/GameShell';
import { useMati } from '../../components/Mati';
import { ReplayIcon } from '../../components/icons';
import { IconButton } from '../../components/ui';
import { navigate, ROUTES } from '../../app/routes';
import { playMotion } from '../../core/motion';
import { useTimers } from '../../core/useTimers';
import { cx, type CSSVars } from '../../core/utils';
import { getColor, type ColorId } from '../../data/colors';
import { getObject } from '../../data/objects';
import { celebrateSuccess, encourageRetry } from '../../feedback/feedback';
import { ObjectArt } from '../../illustrations/ObjectArt';
import { makeColorObjectRound } from './colorRounds';
import './colors.css';

export function ColorObjects() {
  const mati = useMati();
  const timers = useTimers();
  const [correctTotal, setCorrectTotal] = useState(0);
  const [round, setRound] = useState(() => makeColorObjectRound(0));
  const [solved, setSolved] = useState(false);
  const object = getObject(round.item.kind);

  useEffect(() => {
    const timer = window.setTimeout(() => say(colorQuestionSpeech(object)), 500);
    return () => window.clearTimeout(timer);
  }, [object, round.id]);

  const press = (color: ColorId, event: MouseEvent<HTMLButtonElement>) => {
    if (solved) return;
    if (color !== round.item.color) {
      playMotion(event.currentTarget, 'shake');
      mati.encourage();
      encourageRetry();
      return;
    }
    playMotion(event.currentTarget, 'pop', 600);
    const total = correctTotal + 1;
    setSolved(true);
    setCorrectTotal(total);
    celebrateSuccess(praiseWithColorObject(round.item));
    mati.celebrate();
    timers.schedule('next', 2600, () => {
      setSolved(false);
      setRound(makeColorObjectRound(total));
    });
  };

  return (
    <GameShell
      title="Objetos de colores"
      onBack={() => navigate(ROUTES.colors)}
      mati={mati}
      actions={
        <IconButton label="Repetir la pregunta" tone="warm" onClick={() => say(colorQuestionSpeech(object))}>
          <ReplayIcon />
        </IconButton>
      }
    >
      <section className="color-quiz">
        <div className="color-quiz__object">
          <ObjectArt
            key={round.id}
            kind={round.item.kind}
            color={getColor(round.item.color).hex}
            className="color-quiz__art"
          />
        </div>
        <div className="color-quiz__options">
          {round.options.map((color) => (
            <button
              key={`${round.id}-${color}`}
              type="button"
              aria-label={getColor(color).name}
              className={cx('color-chip', color === 'white' && 'is-white')}
              style={{ '--chip': getColor(color).hex } as CSSVars}
              onClick={(event) => press(color, event)}
            />
          ))}
        </div>
      </section>
    </GameShell>
  );
}
