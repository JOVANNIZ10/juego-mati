import { afterEach, describe, expect, it, vi } from 'vitest';

const { speakMock } = vi.hoisted(() => ({ speakMock: vi.fn() }));

vi.mock('./speech', () => ({ speak: speakMock }));
vi.mock('./sfx', () => ({ getAudioContext: () => null }));
vi.mock('./soundSettings', () => ({
  isSoundEnabled: () => true,
  subscribeToSound: () => () => undefined,
}));

import { say, unlockVoice } from './voicePlayer';

describe('reproductor de voz', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    speakMock.mockClear();
  });

  it('recurre a la voz del sistema cuando el manifiesto está vacío', async () => {
    vi.stubGlobal('document', { baseURI: 'http://localhost/' });
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ clips: {} }),
    }));
    vi.stubGlobal('fetch', fetchMock);

    unlockVoice();
    say({ parts: ['saludo'], text: '¡Hola, Mati!' });

    await vi.waitFor(() => expect(speakMock).toHaveBeenCalledWith('¡Hola, Mati!'));
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost/voz/manifest.json',
      expect.objectContaining({ cache: 'no-cache' }),
    );
  });
});
