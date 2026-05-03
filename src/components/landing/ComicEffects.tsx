import { motion } from 'framer-motion';
import { useMemo } from 'react';

export type ComicTheme = 'invitation' | 'portal' | 'ruby' | 'keys';

interface Props {
  theme: ComicTheme;
  reduceMotion?: boolean;
}

const STAR_PALETTES: Record<ComicTheme, string[]> = {
  invitation: ['#FBBF24', '#FB7185', '#F472B6'],
  portal:     ['#A78BFA', '#60A5FA', '#F0ABFC'],
  ruby:       ['#34D399', '#FCA5A5', '#FBBF24'],
  keys:       ['#FBBF24', '#FCA5A5', '#FDE68A'],
};

const STAR_SYMBOLS = ['✦', '✨', '⭐'];

export function ComicEffects({ theme, reduceMotion = false }: Props) {
  const stars = useMemo(() => {
    const palette = STAR_PALETTES[theme];
    const count = 14;
    return Array.from({ length: count }, (_, i) => ({
      key: `s-${i}`,
      left: `${(i * 71 + 7) % 96}%`,
      top: `${(i * 47 + 13) % 92}%`,
      delay: ((i * 0.13) % 2),
      duration: 1.6 + (i % 4) * 0.4,
      size: 12 + (i % 4) * 4,
      color: palette[i % palette.length],
      symbol: STAR_SYMBOLS[i % STAR_SYMBOLS.length],
    }));
  }, [theme]);

  const cubes = useMemo(() => {
    const count = 7;
    return Array.from({ length: count }, (_, i) => ({
      key: `c-${i}`,
      left: `${(i * 37 + 5) % 92}%`,
      top: `${(i * 23 + 17) % 80}%`,
      delay: i * 0.18,
      duration: 5 + (i % 3) * 1.4,
      rotate: (i * 53) % 360,
      glyph: i % 2 === 0 ? '🧊' : '◆',
      size: 18 + (i % 3) * 6,
    }));
  }, [theme]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {stars.map(s => (
        <motion.span
          key={s.key}
          className="absolute select-none"
          style={{ left: s.left, top: s.top, color: s.color, fontSize: s.size }}
          initial={{ opacity: 0.2, y: 0, scale: 0.9 }}
          animate={
            reduceMotion
              ? { opacity: 0.8 }
              : { opacity: [0.25, 1, 0.25], y: [0, -10, 0], scale: [0.9, 1.1, 0.9] }
          }
          transition={
            reduceMotion
              ? undefined
              : { duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          {s.symbol}
        </motion.span>
      ))}
      {cubes.map(c => (
        <motion.span
          key={c.key}
          className="absolute select-none"
          style={{ left: c.left, top: c.top, fontSize: c.size, color: '#FFFFFF', opacity: 0.55 }}
          initial={{ rotate: c.rotate, y: 0 }}
          animate={
            reduceMotion
              ? undefined
              : { rotate: c.rotate + 360, y: [0, -16, 0] }
          }
          transition={
            reduceMotion
              ? undefined
              : { duration: c.duration, delay: c.delay, repeat: Infinity, ease: 'linear' }
          }
        >
          {c.glyph}
        </motion.span>
      ))}
    </div>
  );
}
