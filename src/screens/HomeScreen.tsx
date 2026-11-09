import { useEffect } from 'react';
import { say } from '../audio';
import { greeting } from '../audio/utterances';
import { Mati, useMati } from '../components/Mati';
import { HubCard, SoundToggle } from '../components/ui';
import { navigate, ROUTES } from '../app/routes';
import { ColorsArt, CombinedArt, NumbersArt } from '../illustrations/cardArt';
import './screens.css';

const HOME_CARDS = [
  {
    label: '🔢 ¡A jugar con los números!',
    art: <NumbersArt />,
    from: '#ffe27a',
    to: '#ff9f43',
    ink: '#3b2a5a',
    route: ROUTES.numbers,
  },
  {
    label: '🎨 ¡A jugar con los colores!',
    art: <ColorsArt />,
    from: '#ff9ecd',
    to: '#a66cff',
    route: ROUTES.colors,
  },
  {
    label: '⭐ ¡A jugar y descubrir!',
    art: <CombinedArt />,
    from: '#7ee8d0',
    to: '#3ba3ff',
    route: ROUTES.combined,
  },
];

export function HomeScreen() {
  const mati = useMati('wave');

  useEffect(() => {
    say(greeting());
  }, []);

  return (
    <div className="home">
      <div className="home__sound">
        <SoundToggle />
      </div>
      <header className="home__hero">
        <h1 className="home__title">
          <span className="home__title-text">¡Hola, Mati!</span> <span className="home__emoji">🌈</span>
        </h1>
        <p className="home__subtitle">¿Jugamos juntos?</p>
      </header>
      <div className="home__body">
        <Mati mood={mati.mood} onClick={mati.tap} className="home__mati" />
        <nav className="home__cards" aria-label="Elige un juego">
          {HOME_CARDS.map((card, index) => (
            <HubCard
              key={card.route}
              index={index}
              label={card.label}
              art={card.art}
              from={card.from}
              to={card.to}
              ink={card.ink}
              onClick={() => navigate(card.route)}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}
