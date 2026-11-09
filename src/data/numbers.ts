export const MIN_NUMBER = 1;
export const MAX_NUMBER = 20;

export const NUMBER_PALETTE = ['#ff4b4b', '#ff8c2b', '#ffc233', '#43c75b', '#2ec4b6', '#3ba3ff', '#a66cff', '#ff7eb6'];

export function numberColor(value: number): string {
  return NUMBER_PALETTE[(value - MIN_NUMBER) % NUMBER_PALETTE.length];
}
