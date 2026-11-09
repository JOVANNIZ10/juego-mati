import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/fredoka';
import './styles/base.css';
import './styles/animations.css';
import { App } from './App';
import { unlockAudio } from './audio';

window.addEventListener('pointerdown', unlockAudio, { capture: true, once: true });
window.addEventListener('keydown', unlockAudio, { capture: true, once: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
