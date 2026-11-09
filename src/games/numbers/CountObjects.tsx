import { useEffect, useState } from 'react';
import { say } from '../../audio';
import { countHint, countQuestionSpeech, praiseWithNumber } from '../../audio/utterances';
import { AutoGrid } from '../../components/AutoGrid';
import { GameShell } from '../../components/GameShell';
import { useMati } from '../../components/Mati';
import { ReplayIcon } from '../../components/icons';
import { AnswerTile, IconButton } from '../../components/ui';
import { navigate, ROUTES } from '../../app/routes';
import { getColor } from '../../data/colors';
import { getObject } from '../../data/objects';
import { celebrateSuccess, encourageRetry } from '../../feedback/feedback';
import { useTimers } from '../../core/useTimers';
import { ObjectArt } from '../../illustrations/ObjectArt';
import { countLevelMax, makeCountRound } from './numberRounds';
import './numbers.css';

const TILE_COLORS = ['#ffc2dd', '#b9f5d9', '#bfe6ff'];
const INK = '#3b2a5a';

export function CountObjects() {
  const mati = useMati();
  const timers = useTimers();
  const [correctTotal, setCorrectTotal] = useState(0);
  const [round, setRound] = useState(() => makeCountRound(countLevelMax(0)));
  const [misses, setMisses] = useState(0);
  const [solved, setSolved] = useState(false);
  const object = getObject(round.kind);
  const color = getColor(round.color).hex;

  useEffect(() => {
    const timer = window.setTimeout(() => say(countQuestionSpeech(object)), 600);
    return () => window.clearTimeout(timer);
  }, [object, round.id]);

  const handleCorrect = () => {
    if (solved) return;
    const total = correctTotal + 1;
    const previous = round.count;
    setSolved(true);
    setCorrectTotal(total);
    celebrateSuccess(praiseWithNumber(previous));
    mati.celebrate();
    timers.schedule('next', 2600, () => {
      setSolved(false);
      setMisses(0);
      setRound(makeCountRound(countLevelMax(total), previous));
    });
  };

  const handleWrong = () => {
    if (solved) return;
    const nextMisses = misses + 1;
    setMisses(nextMisses);
    mati.encourage();
    if (nextMisses === 2) say(countHint(round.count));
    else encourageRetry();
  };

  const hinting = misses >= 2 && !solved;

  return (
    <GameShell
      title="Cuenta los objetos"
      onBack={() => navigate(ROUTES.numbers)}
      mati={mati}
      actions={
        <IconButton label="Repetir la pregunta" tone="warm" onClick={() => say(countQuestionSpeech(object))}>
          <ReplayIcon />
        </IconButton>
      }
    >
      <section className="count">
        <div className="count__objects">
          <AutoGrid key={round.id} count={round.count} maxSize={200} gap={12}>
            {() => <ObjectArt kind={round.kind} color={color} />}
          </AutoGrid>
        </div>
        <div className="count__answers">
          {round.options.map((value, index) => (
            <AnswerTile
              key={`${round.id}-${index}`}
              label={`Respuesta ${value}`}
              correct={value === round.count}
              disabled={solved}
              hint={hinting && value === round.count}
              background={TILE_COLORS[index]}
              ink={INK}
              onPress={(ok) => (ok ? handleCorrect() : handleWrong())}
            >
              {value}
            </AnswerTile>
          ))}
        </div>
      </section>
    </GameShell>
  );
}
