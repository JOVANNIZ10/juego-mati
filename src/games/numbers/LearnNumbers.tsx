import { useState, type MouseEvent } from 'react';
import { playSfx, say } from '../../audio';
import { numberSpeech } from '../../audio/utterances';
import { AutoGrid } from '../../components/AutoGrid';
import { GameShell } from '../../components/GameShell';
import { useMati } from '../../components/Mati';
import { IconButton } from '../../components/ui';
import { ArrowLeftIcon, ArrowRightIcon } from '../../components/icons';
import { navigate, ROUTES } from '../../app/routes';
import { playMotion } from '../../core/motion';
import { type CSSVars } from '../../core/utils';
import { MAX_NUMBER, MIN_NUMBER, numberColor } from '../../data/numbers';
import { burstAt, celebrate } from '../../effects/effects';
import { ObjectArt } from '../../illustrations/ObjectArt';
import './numbers.css';

export function LearnNumbers() {
  const mati = useMati();
  const [value, setValue] = useState(MIN_NUMBER);
  const color = numberColor(value);

  const move = (step: number) => {
    const next = ((value - MIN_NUMBER + step + MAX_NUMBER) % MAX_NUMBER) + MIN_NUMBER;
    setValue(next);
    playSfx('tap');
    say(numberSpeech(next));
    mati.happy();
  };

  const sayNumber = (event: MouseEvent<HTMLButtonElement>) => {
    playMotion(event.currentTarget, 'pop', 600);
    playSfx('sparkle');
    say(numberSpeech(value));
    celebrate();
    mati.celebrate();
  };

  const tapStar = (index: number, event: MouseEvent<HTMLButtonElement>) => {
    playMotion(event.currentTarget, 'bounce');
    playSfx('pop');
    burstAt(event.clientX, event.clientY, color);
    say(numberSpeech(index + 1));
  };

  return (
    <GameShell title="Aprende los números" onBack={() => navigate(ROUTES.numbers)} mati={mati}>
      <section className="learn">
        <div className="learn__numeral">
          <button
            type="button"
            className="numeral"
            style={{ '--num': color } as CSSVars}
            onClick={sayNumber}
            aria-label={`Número ${value}`}
          >
            {value}
          </button>
          <div className="learn__nav">
            <IconButton label="Número anterior" tone="cool" onClick={() => move(-1)}>
              <ArrowLeftIcon />
            </IconButton>
            <IconButton label="Número siguiente" tone="cool" onClick={() => move(1)}>
              <ArrowRightIcon />
            </IconButton>
          </div>
        </div>
        <div className="learn__objects">
          <AutoGrid key={value} count={value} maxSize={190} gap={14}>
            {(index) => (
              <button
                type="button"
                className="star-button"
                style={{ '--i': index } as CSSVars}
                onClick={(event) => tapStar(index, event)}
                aria-label={`${index + 1}`}
              >
                <ObjectArt kind="star" color={color} />
              </button>
            )}
          </AutoGrid>
        </div>
      </section>
    </GameShell>
  );
}
