import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'mati-sonido';
const listeners = new Set<() => void>();

function readStoredPreference(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
}

let enabled = readStoredPreference();

export function isSoundEnabled(): boolean {
  return enabled;
}

export function setSoundEnabled(value: boolean): void {
  enabled = value;
  try {
    localStorage.setItem(STORAGE_KEY, value ? 'on' : 'off');
  } catch {
    /* sin almacenamiento disponible el ajuste dura solo esta sesión */
  }
  listeners.forEach((listener) => listener());
}

export function toggleSound(): void {
  setSoundEnabled(!enabled);
}

export function subscribeToSound(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useSoundEnabled(): boolean {
  return useSyncExternalStore(subscribeToSound, isSoundEnabled);
}
