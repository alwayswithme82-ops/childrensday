import { useCallback } from 'react';
import { Howl } from 'howler';
import { useSoundStore } from '../stores/useSoundStore';

const cache: Record<string, Howl> = {};

const SFX: Record<string, string> = {
  click:   '/audio/sfx-click.mp3',
  correct: '/audio/sfx-correct.mp3',
  wrong:   '/audio/sfx-wrong.mp3',
  fanfare: '/audio/sfx-fanfare.mp3',
  place:   '/audio/sfx-place.mp3',
};

function getHowl(src: string, volume: number): Howl {
  if (!cache[src]) {
    cache[src] = new Howl({ src: [src], volume });
  }
  return cache[src];
}

export function useSound() {
  const { isMuted, volume } = useSoundStore();

  const play = useCallback((name: keyof typeof SFX) => {
    if (isMuted) return;
    const src = SFX[name];
    if (!src) return;
    const h = getHowl(src, volume);
    h.volume(volume);
    h.play();
  }, [isMuted, volume]);

  return { play };
}
