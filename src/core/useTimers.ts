import { useCallback, useEffect, useMemo, useRef } from 'react';

export function useTimers() {
  const timers = useRef(new Map<string, number>());

  const clear = useCallback((key: string) => {
    const id = timers.current.get(key);
    if (id !== undefined) {
      window.clearTimeout(id);
      timers.current.delete(key);
    }
  }, []);

  const schedule = useCallback(
    (key: string, delay: number, callback: () => void) => {
      clear(key);
      const id = window.setTimeout(() => {
        timers.current.delete(key);
        callback();
      }, delay);
      timers.current.set(key, id);
    },
    [clear],
  );

  useEffect(() => {
    const active = timers.current;
    return () => {
      active.forEach((id) => window.clearTimeout(id));
      active.clear();
    };
  }, []);

  return useMemo(() => ({ schedule, clear }), [schedule, clear]);
}
