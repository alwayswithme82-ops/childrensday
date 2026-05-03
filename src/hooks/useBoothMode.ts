import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/useGameStore';
import { useSoundStore } from '../stores/useSoundStore';

const IDLE_TIMEOUT_MS = 3 * 60 * 1000;
const IDLE_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'touchmove'] as const;

export function useBoothMode(): boolean {
  return useMemo(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('booth') === 'true';
  }, []);
}

/**
 * 부스 모드의 모든 사이드 이펙트를 한 곳에서 처리.
 * - 풀스크린 자동 진입 (사용자 첫 입력 후)
 * - UI 1.2배 스케일 (root font-size)
 * - 사운드 강제 ON
 * - 3분 미활동 시 홈으로 리셋
 */
export function useBoothModeEffects() {
  const enabled = useBoothMode();
  const navigate = useNavigate();
  const reset = useGameStore(s => s.reset);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add('booth-mode');

    const { isMuted, toggleMute } = useSoundStore.getState();
    if (isMuted) toggleMute();

    const enterFullscreen = () => {
      const el = document.documentElement;
      if (!document.fullscreenElement && el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      }
      window.removeEventListener('click', enterFullscreen);
      window.removeEventListener('keydown', enterFullscreen);
      window.removeEventListener('touchstart', enterFullscreen);
    };
    window.addEventListener('click', enterFullscreen, { once: false });
    window.addEventListener('keydown', enterFullscreen, { once: false });
    window.addEventListener('touchstart', enterFullscreen, { once: false });

    return () => {
      document.documentElement.classList.remove('booth-mode');
      window.removeEventListener('click', enterFullscreen);
      window.removeEventListener('keydown', enterFullscreen);
      window.removeEventListener('touchstart', enterFullscreen);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    let timer: ReturnType<typeof setTimeout> | null = null;
    const resetIdle = () => {
      if (timer !== null) clearTimeout(timer);
      timer = setTimeout(() => {
        reset();
        navigate('/');
      }, IDLE_TIMEOUT_MS);
    };

    IDLE_EVENTS.forEach(ev => window.addEventListener(ev, resetIdle, { passive: true }));
    resetIdle();

    return () => {
      if (timer !== null) clearTimeout(timer);
      IDLE_EVENTS.forEach(ev => window.removeEventListener(ev, resetIdle));
    };
  }, [enabled, navigate, reset]);
}
