import { useCallback, useRef } from 'react';
import { Howl } from 'howler';
import { useSoundStore } from '../stores/useSoundStore';

// --- Web Audio API fallback ---
let _ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (!_ctx) _ctx = new AudioContext();
    if (_ctx.state === 'suspended') _ctx.resume();
    return _ctx;
  } catch {
    return null;
  }
}

function beep(freq: number, dur: number, vol: number) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol * 0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  osc.start();
  osc.stop(ctx.currentTime + dur);
}

function fanfareBeep(vol: number) {
  [523, 659, 784].forEach((f, i) => setTimeout(() => beep(f, 0.25, vol), i * 160));
}

// --- Howl cache with fallback ---
const cache: Record<string, { howl: Howl; failed: boolean }> = {};

function getHowl(src: string, vol: number) {
  if (!cache[src]) {
    const entry: { howl: Howl; failed: boolean } = {
      failed: false,
      howl: new Howl({
        src: [src],
        volume: vol,
        onloaderror: () => { entry.failed = true; },
      }),
    };
    cache[src] = entry;
  }
  return cache[src];
}

const SFX_PATHS: Record<string, string> = {
  click:   '/audio/sfx-click.mp3',
  correct: '/audio/sfx-correct.mp3',
  wrong:   '/audio/sfx-wrong.mp3',
  fanfare: '/audio/sfx-fanfare.mp3',
  place:   '/audio/sfx-place.mp3',
  hint:    '/audio/sfx-hint.mp3',
};

const SFX_FALLBACK: Record<string, () => void> = {
  click:   () => beep(600, 0.10, 1),
  correct: () => beep(880, 0.20, 1),
  wrong:   () => beep(200, 0.30, 1),
  fanfare: () => fanfareBeep(1),
  place:   () => beep(440, 0.15, 1),
  hint:    () => beep(520, 0.15, 1),
};

const BGM_PATH = '/audio/bgm.mp3';

export function useSound() {
  const { isMuted, volume } = useSoundStore();
  const bgmRef = useRef<Howl | null>(null);

  const playSfx = useCallback((name: string) => {
    if (isMuted) return;
    const src = SFX_PATHS[name];
    if (!src) return;
    const entry = getHowl(src, volume);
    if (entry.failed) {
      SFX_FALLBACK[name]?.();
    } else {
      entry.howl.volume(volume);
      entry.howl.play();
    }
  }, [isMuted, volume]);

  // Kept for backward compatibility with GamePage
  const play = playSfx;

  const playBGM = useCallback(() => {
    if (isMuted) return;
    if (!bgmRef.current) {
      bgmRef.current = new Howl({
        src: [BGM_PATH],
        loop: true,
        volume: volume * 0.4,
        onloaderror: () => { bgmRef.current = null; },
      });
    }
    if (!bgmRef.current.playing()) bgmRef.current.play();
  }, [isMuted, volume]);

  const stopBGM = useCallback(() => {
    bgmRef.current?.stop();
  }, []);

  const playCorrect = useCallback(() => playSfx('correct'), [playSfx]);
  const playWrong   = useCallback(() => playSfx('wrong'),   [playSfx]);
  const playClick   = useCallback(() => playSfx('click'),   [playSfx]);
  const playHint    = useCallback(() => playSfx('hint'),    [playSfx]);
  const playFanfare = useCallback(() => {
    if (isMuted) return;
    const src = SFX_PATHS.fanfare;
    const entry = getHowl(src, volume);
    if (entry.failed) {
      fanfareBeep(volume);
    } else {
      entry.howl.volume(volume);
      entry.howl.play();
    }
  }, [isMuted, volume]);

  return { play, playBGM, stopBGM, playCorrect, playWrong, playClick, playHint, playFanfare };
}
