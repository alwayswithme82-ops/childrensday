import ReactConfetti from 'react-confetti';
import { useEffect, useState } from 'react';

export function Confetti() {
  const [pieces, setPieces] = useState(120);
  const [recycle, setRecycle] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmallScreen = window.matchMedia('(max-width: 640px)').matches;
    if (prefersReducedMotion) {
      setPieces(0);
      setRecycle(false);
      return;
    }
    if (isSmallScreen) setPieces(70);

    const stop = setTimeout(() => {
      setRecycle(false);
      setPieces(0);
    }, 2200);
    return () => clearTimeout(stop);
  }, []);

  return (
    <ReactConfetti
      numberOfPieces={pieces}
      recycle={recycle}
      gravity={0.18}
      tweenDuration={1600}
      style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }}
    />
  );
}
