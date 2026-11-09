import { useEffect, useState, type MouseEvent } from 'react';
import { playSfx, say } from '../../audio';
import { combinedSpeech, numberSpeech } from '../../audio/utterances';
import { AutoGrid } from '../../components/AutoGrid';
import { GameShell } from '../../components/GameShell';
import { useMati } from '../../components/Mati';
import { ReplayIcon } from '../../components/icons';
import { AnswerTile, IconButton } from '../../components/ui';
import { navigate, ROUTES } from '../../app/routes';
import { isLight } from '../../core/color';
import { playMotion } from '../../core/motion';
import { useTimers } from '../../core/useTimers';
import { cx, type CSSVars } from '../../core/utils';
import { getColor } from '../../data/colors';
import { burstAt } from '../../effects/effects';
import { celebrateSuccess, encourageRetry } from '../../feedback/feedback';
import { ObjectArt } from '../../illustrations/ObjectArt';
import { makeCombinedTask, type CombinedTask } from './combinedRounds';
import './combined.css';

const INK = '#3b2a5a';

function TaskCue({ task }: { task: CombinedTask }) {
  if (task.type === 'numbers') {
    const hex = getColor(task.color).hex;
    return (
      <div className="cue">
        <span className="cue__chip" style={{ '--chip': hex, '--chip-ink': isLight(hex) ? INK : '#ffffff' } as CSSVars}>
          {task.value}
        </span>
      </div>
    );
  }
  return (
    <div className="cue">
      <span className="cue__art">
        <ObjectArt kind={task.target.kind} color={getColor(task.target.color).hex} />
      </span>
      <span className="cue__count">{task.count}</span>
    </div>
  );
}

function Progress({ completed }: { completed: number }) {
  const filled = completed === 0 ? 0 : ((completed - 1) % 5) + 1;
  return (
    <div className="progress" aria-label={`Tareas completadas: ${completed}`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={cx('progress__star', index < filled && 'is-on')} />
      ))}
    </div>
  );
}

export function CombinedMode() {
  const mati = useMati();
  const timers = useTimers();
  const [completed, setCompleted] = useState(0);
  const [task, setTask] = useState<CombinedTask>(() => makeCombinedTask(0));
  const [found, setFound] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => say(combinedSpeech(task)), 500);
    return () => window.clearTimeout(timer);
  }, [task]);

  const complete = () => {
    const total = completed + 1;
    setSolved(true);
    setCompleted(total);
    celebrateSuccess();
    mati.celebrate();
    timers.schedule('next', 2600, () => {
      setFound([]);
      setSolved(false);
      setTask(makeCombinedTask(total));
    });
  };

  const reject = () => {
    mati.encourage();
    encourageRetry();
    timers.schedule('retry', 1800, () => say(combinedSpeech(task)));
  };

  const pickItem = (index: number, event: MouseEvent<HTMLButtonElement>) => {
    if (solved || found.includes(index) || task.type !== 'find') return;
    const item = task.board[index];
    if (item.kind !== task.target.kind || item.color !== task.target.color) {
      playMotion(event.currentTarget, 'shake');
      reject();
      return;
    }
    const nextFound = [...found, index];
    setFound(nextFound);
    playMotion(event.currentTarget, 'pop');
    playSfx('sparkle');
    burstAt(event.clientX, event.clientY, getColor(item.color).hex);
    if (nextFound.length === task.count) complete();
    else say(numberSpeech(nextFound.length));
  };

  const pickPanel = (index: number, event: MouseEvent<HTMLButtonElement>) => {
    if (solved || task.type !== 'panels') return;
    if (index === task.answer) {
      playMotion(event.currentTarget, 'pop');
      complete();
    } else {
      playMotion(event.currentTarget, 'shake');
      reject();
    }
  };

  return (
    <GameShell
      title="¡A jugar y descubrir!"
      onBack={() => navigate(ROUTES.home)}
      mati={mati}
      actions={
        <IconButton label="Repetir la pregunta" tone="warm" onClick={() => say(combinedSpeech(task))}>
          <ReplayIcon />
        </IconButton>
      }
    >
      <section className="combined">
        <div className="combined__top">
          <TaskCue task={task} />
          <Progress completed={completed} />
        </div>
        <div className="combined__board">
          {task.type === 'find' && (
            <AutoGrid key={task.id} count={task.board.length} maxSize={150} gap={12}>
              {(index) => {
                const item = task.board[index];
                const done = found.includes(index);
                return (
                  <button
                    type="button"
                    className={cx('board-item', done && 'is-found')}
                    disabled={done}
                    aria-label={`Objeto ${index + 1}`}
                    onClick={(event) => pickItem(index, event)}
                  >
                    <ObjectArt kind={item.kind} color={getColor(item.color).hex} />
                  </button>
                );
              }}
            </AutoGrid>
          )}
          {task.type === 'panels' &&
            task.panels.map((panel, index) => (
              <button
                key={`${task.id}-${index}`}
                type="button"
                className="panel-choice"
                aria-label={`Opción ${index + 1}`}
                onClick={(event) => pickPanel(index, event)}
              >
                <AutoGrid count={panel.length} maxSize={120} gap={8}>
                  {(item) => <ObjectArt kind={panel[item].kind} color={getColor(panel[item].color).hex} />}
                </AutoGrid>
              </button>
            ))}
          {task.type === 'numbers' && (
            <AutoGrid key={task.id} count={task.board.length} maxSize={170} gap={14}>
              {(index) => {
                const tile = task.board[index];
                const hex = getColor(tile.color).hex;
                return (
                  <AnswerTile
                    label={`Número ${tile.value}`}
                    correct={tile.value === task.value && tile.color === task.color}
                    disabled={solved}
                    background={hex}
                    ink={isLight(hex) ? INK : '#ffffff'}
                    onPress={(ok) => (ok ? complete() : reject())}
                  >
                    {tile.value}
                  </AnswerTile>
                );
              }}
            </AutoGrid>
          )}
        </div>
      </section>
    </GameShell>
  );
}
