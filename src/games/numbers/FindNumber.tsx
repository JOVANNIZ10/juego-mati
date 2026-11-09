import { useEffect, useState } from 'react';
import { say } from '../../audio';
import { findNumberSpeech } from '../../audio/utterances';
import { GameShell } from '../../components/GameShell';
import { useMati } from '../../components/Mati';
import { ReplayIcon } from '../../components/icons';
import { AnswerTile, IconButton } from '../../components/ui';
import { navigate, ROUTES } from '../../app/routes';
import { isLight } from '../../core/color';
import { useTimers } from '../../core/useTimers';
import { numberColor } from '../../data/numbers';
import { celebrateSuccess, encourageRetry } from '../../feedback/feedback';
import { findOptionCount, findRangeMax, makeFindRound } from './numberRounds';
import './numbers.css';

const INK = '#3b2a5a';

export function FindNumber() {
  const mati = useMati();
  const timers = useTimers();
  const [correctTotal, setCorrectTotal] = useState(0);
  const [round, setRound] = useState(() => makeFindRound(findRangeMax(0), findOptionCount(0)));
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => say(findNumberSpeech(round.target)), 500);
    return () => window.clearTimeout(timer);
  }, [round.id, round.target]);

  const handleCorrect = () => {
    if (solved) return;
    const total = correctTotal + 1;
    setSolved(true);
    setCorrectTotal(total);
    celebrateSuccess();
    mati.celebrate();
    timers.schedule('next', 2400, () => {
      setSolved(false);
      setRound(makeFindRound(findRangeMax(total), findOptionCount(total)));
    });
  };

  const handleWrong = () => {
    if (solved) return;
    mati.encourage();
    encourageRetry();
    timers.schedule('retry', 1800, () => say(findNumberSpeech(round.target)));
  };

  return (
    <GameShell
      title="Encuentra el número"
      onBack={() => navigate(ROUTES.numbers)}
      mati={mati}
      actions={
        <IconButton label="Repetir la pregunta" tone="warm" onClick={() => say(findNumberSpeech(round.target))}>
          <ReplayIcon />
        </IconButton>
      }
    >
      <section className="find">
        <div className="find__stage">
          {round.options.map((value) => {
            const background = numberColor(value);
            return (
              <AnswerTile
                key={`${round.id}-${value}`}
                label={`Número ${value}`}
                correct={value === round.target}
                disabled={solved}
                background={background}
                ink={isLight(background) ? INK : '#ffffff'}
                onPress={(ok) => (ok ? handleCorrect() : handleWrong())}
              >
                {value}
              </AnswerTile>
            );
          })}
        </div>
      </section>
    </GameShell>
  );
}
