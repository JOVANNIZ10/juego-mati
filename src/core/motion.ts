export type MotionName = 'pop' | 'shake' | 'bounce' | 'wiggle';

const KEYFRAMES: Record<MotionName, Keyframe[]> = {
  pop: [
    { transform: 'scale(1)' },
    { transform: 'scale(1.18)', offset: 0.4 },
    { transform: 'scale(0.96)', offset: 0.7 },
    { transform: 'scale(1)' },
  ],
  shake: [
    { transform: 'translateX(0)' },
    { transform: 'translateX(-10px)', offset: 0.2 },
    { transform: 'translateX(10px)', offset: 0.4 },
    { transform: 'translateX(-7px)', offset: 0.6 },
    { transform: 'translateX(5px)', offset: 0.8 },
    { transform: 'translateX(0)' },
  ],
  bounce: [
    { transform: 'translateY(0) scale(1)' },
    { transform: 'translateY(-16px) scale(1.08, 0.94)', offset: 0.3 },
    { transform: 'translateY(0) scale(0.96, 1.04)', offset: 0.6 },
    { transform: 'translateY(0) scale(1)' },
  ],
  wiggle: [
    { transform: 'rotate(0deg)' },
    { transform: 'rotate(-8deg)', offset: 0.25 },
    { transform: 'rotate(8deg)', offset: 0.75 },
    { transform: 'rotate(0deg)' },
  ],
};

export function playMotion(element: Element | null, name: MotionName, duration = 480): void {
  if (!element || typeof element.animate !== 'function') return;
  element.animate(KEYFRAMES[name], { duration, easing: 'ease-in-out' });
}
