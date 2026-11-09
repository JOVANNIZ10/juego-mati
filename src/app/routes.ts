import { useEffect, useState } from 'react';

export const ROUTES = {
  home: '/',
  numbers: '/numeros',
  numbersLearn: '/numeros/aprende',
  numbersCount: '/numeros/cuenta',
  numbersFind: '/numeros/encuentra',
  numbersExplode: '/numeros/explosion',
  colors: '/colores',
  colorsDiscover: '/colores/descubre',
  colorsFind: '/colores/encuentra',
  colorsObjects: '/colores/objetos',
  colorsFactory: '/colores/fabrica',
  combined: '/combinado',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
export type Section = 'home' | 'numbers' | 'colors' | 'combined';

const ROUTE_VALUES = new Set<string>(Object.values(ROUTES));

function readRoute(): Route {
  const path = window.location.hash.replace(/^#/, '') || '/';
  return ROUTE_VALUES.has(path) ? (path as Route) : ROUTES.home;
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(readRoute);

  useEffect(() => {
    const update = () => setRoute(readRoute());
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  return route;
}

export function navigate(route: Route): void {
  window.location.hash = route;
}

export function sectionOf(route: Route): Section {
  if (route.startsWith('/numeros')) return 'numbers';
  if (route.startsWith('/colores')) return 'colors';
  if (route.startsWith('/combinado')) return 'combined';
  return 'home';
}
