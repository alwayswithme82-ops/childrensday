import { motion } from 'framer-motion';
import type { ReactNode, MouseEventHandler } from 'react';

interface Props {
  children: ReactNode;
  background?: string;
  rotate?: number;
  onClick?: MouseEventHandler<HTMLDivElement>;
  className?: string;
}

export function ComicScene({
  children,
  background,
  rotate = 0,
  onClick,
  className = '',
}: Props) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 30, scale: 0.92, rotate: rotate - 1.5 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate }}
      exit={{ opacity: 0, x: -30, scale: 0.96 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className={`relative w-full max-w-2xl overflow-hidden rounded-[2.4rem] border-[4px] border-slate-900 shadow-[10px_10px_0_rgba(15,23,42,0.85)] ${className}`}
      style={{
        background:
          background ?? 'linear-gradient(160deg, #FFFDE7 0%, #FCE4EC 100%)',
      }}
    >
      {/* Soft inner halo so emoji pop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 35%, rgba(255,255,255,0.55), transparent 55%)',
        }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
