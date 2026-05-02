import { create } from 'zustand';
import type { SoundState } from '../types/game';

const STORAGE_KEY = 'cube_sound';

const loadPersistedSound = (): { isMuted: boolean; volume: number } => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { isMuted: false, volume: 0.7 };
};

const persistSound = (isMuted: boolean, volume: number) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ isMuted, volume }));
  } catch {}
};

const initial = loadPersistedSound();

export const useSoundStore = create<SoundState>((set) => ({
  isMuted: initial.isMuted,
  volume: initial.volume,

  toggleMute: () => {
    set(state => {
      const isMuted = !state.isMuted;
      persistSound(isMuted, state.volume);
      return { isMuted };
    });
  },

  setVolume: (volume: number) => {
    set(state => {
      persistSound(state.isMuted, volume);
      return { volume };
    });
  },
}));
