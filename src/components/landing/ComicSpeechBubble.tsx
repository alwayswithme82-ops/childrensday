import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  speaker?: string;
  children: ReactNode;
  className?: string;
  tone?: 'narrator' | 'character';
}

export function ComicSpeechBubble({
  speaker,
  children,
  className = '',
  tone = speaker ? 'character' : 'narrator',
}: Props) {
  const speakerBg = tone === 'character'
    ? 'bg-pink-300'
    : 'bg-amber-300';

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.86, rotate: -1 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.18 }}
      className={`relative w-full max-w-md rounded-3xl border-[3px] border-slate-900 bg-white px-5 py-4 shadow-[6px_6px_0_rgba(15,23,42,0.95)] ${className}`}
    >
      {speaker && (
        <span
          className={`absolute -top-3 left-5 inline-flex items-center gap-1 rounded-full border-[2px] border-slate-900 px-3 py-0.5 text-xs font-bold text-slate-900 shadow-[2px_2px_0_rgba(15,23,42,0.9)] ${speakerBg}`}
        >
          {speaker}
        </span>
      )}

      <div className="break-keep text-base leading-relaxed text-slate-800 sm:text-lg">
        {children}
      </div>

      {/* Tail (border + fill) */}
      <span
        aria-hidden
        className="absolute -bottom-[14px] left-12 h-0 w-0"
        style={{
          borderLeft: '12px solid transparent',
          borderRight: '12px solid transparent',
          borderTop: '14px solid #0f172a',
        }}
      />
      <span
        aria-hidden
        className="absolute -bottom-[10px] left-[52px] h-0 w-0"
        style={{
          borderLeft: '9px solid transparent',
          borderRight: '9px solid transparent',
          borderTop: '10px solid #ffffff',
        }}
      />
    </motion.div>
  );
}
