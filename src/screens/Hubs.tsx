import { Hub } from './Hub';
import { ROUTES } from '../app/routes';
import {
  BalloonsArt,
  ColorsArt,
  CountArt,
  ExplodeArt,
  FactoryArt,
  FindArt,
  LearnArt,
  ObjectsArt,
} from '../illustrations/cardArt';

export function NumbersHub() {
  return (
    <Hub
      title="Números"
      intro="numbers"
      entries={[
        { label: 'Aprende los números', art: <LearnArt />, from: '#ffe27a', to: '#ff9f43', route: ROUTES.numbersLearn },
        { label: 'Cuenta los objetos', art: <CountArt />, from: '#ffb36b', to: '#ff6f5e', route: ROUTES.numbersCount },
        { label: 'Encuentra el número', art: <FindArt />, from: '#8ef0c0', to: '#29c79a', route: ROUTES.numbersFind },
        { label: 'Explosión de números', art: <ExplodeArt />, from: '#ff8fd0', to: '#ff5c8a', route: ROUTES.numbersExplode },
      ]}
    />
  );
}

export function ColorsHub() {
  return (
    <Hub
      title="Colores"
      intro="colors"
      entries={[
        { label: 'Descubre los colores', art: <ColorsArt />, from: '#ff9ecd', to: '#a66cff', route: ROUTES.colorsDiscover },
        { label: 'Encuentra el color', art: <BalloonsArt />, from: '#8fd8ff', to: '#3ba3ff', route: ROUTES.colorsFind },
        { label: 'Objetos de colores', art: <ObjectsArt />, from: '#b6f4a6', to: '#43c75b', route: ROUTES.colorsObjects },
        { label: 'La fábrica de colores', art: <FactoryArt />, from: '#d6b8ff', to: '#7b5cff', route: ROUTES.colorsFactory },
      ]}
    />
  );
}
