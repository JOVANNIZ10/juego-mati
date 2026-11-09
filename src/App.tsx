import type { ComponentType } from 'react';
import { Background } from './components/Background';
import { EffectsLayer } from './effects/EffectsLayer';
import { ROUTES, sectionOf, useRoute, type Route } from './app/routes';
import { HomeScreen } from './screens/HomeScreen';
import { ColorsHub, NumbersHub } from './screens/Hubs';
import { LearnNumbers } from './games/numbers/LearnNumbers';
import { CountObjects } from './games/numbers/CountObjects';
import { FindNumber } from './games/numbers/FindNumber';
import { NumberExplosion } from './games/numbers/NumberExplosion';
import { DiscoverColors } from './games/colors/DiscoverColors';
import { FindColor } from './games/colors/FindColor';
import { ColorObjects } from './games/colors/ColorObjects';
import { ColorFactory } from './games/colors/ColorFactory';
import { CombinedMode } from './games/combined/CombinedMode';

const SCREENS: Record<Route, ComponentType> = {
  [ROUTES.home]: HomeScreen,
  [ROUTES.numbers]: NumbersHub,
  [ROUTES.numbersLearn]: LearnNumbers,
  [ROUTES.numbersCount]: CountObjects,
  [ROUTES.numbersFind]: FindNumber,
  [ROUTES.numbersExplode]: NumberExplosion,
  [ROUTES.colors]: ColorsHub,
  [ROUTES.colorsDiscover]: DiscoverColors,
  [ROUTES.colorsFind]: FindColor,
  [ROUTES.colorsObjects]: ColorObjects,
  [ROUTES.colorsFactory]: ColorFactory,
  [ROUTES.combined]: CombinedMode,
};

export function App() {
  const route = useRoute();
  const Screen = SCREENS[route];

  return (
    <div className="app" data-section={sectionOf(route)}>
      <Background />
      <div key={route} className="screen">
        <Screen />
      </div>
      <EffectsLayer />
    </div>
  );
}
