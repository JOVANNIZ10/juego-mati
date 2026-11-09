import type { MouseEvent } from 'react';
import { playSfx, say } from '../../audio';
import { colorSpeech } from '../../audio/utterances';
import { AutoGrid } from '../../components/AutoGrid';
import { GameShell } from '../../components/GameShell';
import { useMati } from '../../components/Mati';
import { navigate, ROUTES } from '../../app/routes';
import { shade } from '../../core/color';
import { playMotion } from '../../core/motion';
import { cx, type CSSVars } from '../../core/utils';
import { COLORS, type ColorInfo } from '../../data/colors';
import { burstAt } from '../../effects/effects';
import './colors.css';

export function DiscoverColors() {
  const mati = useMati();

  const press = (color: ColorInfo, event: MouseEvent<HTMLButtonElement>) => {
    playMotion(event.currentTarget, 'pop', 520);
    playSfx('bell');
    burstAt(event.clientX, event.clientY, color.hex);
    say(colorSpeech(color.id));
    mati.happy();
  };

  return (
    <GameShell title="Descubre los colores" onBack={() => navigate(ROUTES.colors)} mati={mati}>
      <section className="discover">
        <AutoGrid count={COLORS.length} maxSize={230} gap={22}>
          {(index) => {
            const color = COLORS[index];
            return (
              <button
                type="button"
                aria-label={color.name}
                className={cx('color-dot', color.id === 'white' && 'is-white')}
                style={
                  {
                    '--dot': color.hex,
                    '--dot-light': shade(color.hex, 55),
                    '--dot-dark': shade(color.hex, -22),
                  } as CSSVars
                }
                onClick={(event) => press(color, event)}
              />
            );
          }}
        </AutoGrid>
      </section>
    </GameShell>
  );
}
