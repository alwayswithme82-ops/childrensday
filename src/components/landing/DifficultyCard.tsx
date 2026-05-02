import { motion } from 'framer-motion';
import type { Difficulty } from '../../types/game';

interface Props {
  difficulty: Difficulty;
  selected: boolean;
  onSelect: (d: Difficulty) => void;
}

const CFG = {
  easy: {
    icon: '🌱', label: '쉬움', sub: '초등 1·2학년',
    scenes: 5, hints: 5, tag: '입문',
    color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', ring: 'rgba(5,150,105,.15)',
  },
  medium: {
    icon: '⚙️', label: '보통', sub: '초등 3·4학년',
    scenes: 6, hints: 3, tag: '도전',
    color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', ring: 'rgba(37,99,235,.15)',
  },
  hard: {
    icon: '🔥', label: '어려움', sub: '초등 5·6학년',
    scenes: 7, hints: 2, tag: '고급',
    color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', ring: 'rgba(124,58,237,.15)',
  },
} as const;

const STARS: Record<string, string> = { easy: '⭐', medium: '⭐⭐', hard: '⭐⭐⭐' };

export function DifficultyCard({ difficulty, selected, onSelect }: Props) {
  const c = CFG[difficulty];
  return (
    <motion.button
      whileHover={{ y: -4, boxShadow: `0 12px 32px ${c.ring}` }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(difficulty)}
      className="relative flex flex-col gap-4 p-5 rounded-2xl w-full text-left cursor-pointer transition-all duration-150"
      style={{
        background: selected ? c.bg : '#FAFAFA',
        border: `2px solid ${selected ? c.color : '#E5E7EB'}`,
        boxShadow: selected ? `0 0 0 4px ${c.ring}, 0 8px 24px ${c.ring}` : '0 2px 8px rgba(0,0,0,.05)',
      }}
    >
      {selected && (
        <motion.span
          layoutId="sel"
          className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full text-xs font-900 text-white"
          style={{ background: c.color }}
        >
          ✓ 선택
        </motion.span>
      )}

      <div className="flex items-center justify-between">
        <span className="text-3xl">{c.icon}</span>
        <span className="text-xs font-800 px-2 py-0.5 rounded-full" style={{ background: c.bg, color: c.color }}>
          {c.tag}
        </span>
      </div>

      <div>
        <p className="text-2xl font-900" style={{ color: selected ? c.color : '#111827' }}>{c.label}</p>
        <p className="text-sm font-600 text-gray-400 mt-0.5">{c.sub}</p>
      </div>

      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
        <span>{STARS[difficulty]}</span>
        <span className="text-xs font-700 text-gray-400">📝 {c.scenes}문제 · 💡 {c.hints}개</span>
      </div>
    </motion.button>
  );
}
