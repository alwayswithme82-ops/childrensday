import ReactConfetti from 'react-confetti';
import { useEffect, useState } from 'react';

export function Confetti() {
  const [pieces, setPieces] = useState(200);
  const [recycle, setRecycle] = useState(true);

  useEffect(() => {
    const stop = setTimeout(() => {
      setRecycle(false);
      setPieces(0);
    }, 3000);
    return () => clearTimeout(stop);
  }, []);

  return (
    <ReactConfetti
      numberOfPieces={pieces}
      recycle={recycle}
      style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }}
    />
  );
}
