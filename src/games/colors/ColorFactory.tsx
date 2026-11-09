import { useState, type PointerEvent } from 'react';
import { playSfx, say } from '../../audio';
import { colorSpeech } from '../../audio/utterances';
import { GameShell } from '../../components/GameShell';
import { useMati } from '../../components/Mati';
import { ArrowRightIcon, TrashIcon } from '../../components/icons';
import { IconButton } from '../../components/ui';
import { navigate, ROUTES } from '../../app/routes';
import { cx, type CSSVars } from '../../core/utils';
import { COLORS, getColor, type ColorId } from '../../data/colors';
import { burstAt } from '../../effects/effects';
import { FIGURES } from './paintFigures';
import './colors.css';

export function ColorFactory() {
  const mati = useMati();
  const [figureIndex, setFigureIndex] = useState(0);
  const [fills, setFills] = useState<Record<string, ColorId>>({});
  const [selected, setSelected] = useState<ColorId>('red');
  const figure = FIGURES[figureIndex];

  const choose = (color: ColorId) => {
    setSelected(color);
    playSfx('tap');
    say(colorSpeech(color));
  };

  const paint = (key: string, event: PointerEvent<SVGPathElement>) => {
    setFills((current) => ({ ...current, [key]: selected }));
    playSfx('pop');
    burstAt(event.clientX, event.clientY, getColor(selected).hex);
    mati.happy();
  };

  const clear = () => {
    setFills({});
    playSfx('whoosh');
  };

  const nextFigure = () => {
    setFigureIndex((index) => (index + 1) % FIGURES.length);
    setFills({});
    playSfx('tap');
  };

  return (
    <GameShell
      title="La fábrica de colores"
      onBack={() => navigate(ROUTES.colors)}
      mati={mati}
      actions={
        <>
          <IconButton label="Borrar colores" tone="warm" onClick={clear}>
            <TrashIcon />
          </IconButton>
          <IconButton label="Otra figura" tone="cool" onClick={nextFigure}>
            <ArrowRightIcon />
          </IconButton>
        </>
      }
    >
      <section className="factory">
        <div className="factory__stage">
          <p className="factory__hint">Elige un color y toca una zona blanca para pintarla.</p>
          <div className="factory__canvas">
            <svg viewBox="0 0 400 400" className="factory__svg" role="img" aria-label={figure.name}>
              {figure.regions.map((region) => {
                const key = `${figure.id}-${region.id}`;
                const painted = fills[key];
                return (
                  <path
                    key={key}
                    d={region.d}
                    className="factory__region"
                    fill={painted ? getColor(painted).hex : '#ffffff'}
                    onPointerDown={(event) => paint(key, event)}
                  />
                );
              })}
            </svg>
          </div>
        </div>
        <div className="factory__palette">
          {COLORS.map((color) => (
            <button
              key={color.id}
              type="button"
              aria-label={color.name}
              aria-pressed={selected === color.id}
              className={cx('palette-dot', selected === color.id && 'is-selected', color.id === 'white' && 'is-white')}
              style={{ '--dot': color.hex } as CSSVars}
              onClick={() => choose(color.id)}
            />
          ))}
        </div>
      </section>
    </GameShell>
  );
}
