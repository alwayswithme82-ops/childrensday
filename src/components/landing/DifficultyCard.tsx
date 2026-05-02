import { motion } from 'framer-motion';
import type { Difficulty } from '../../types/game';

interface Props {
  difficulty: Difficulty;
  selected: boolean;
  onSelect: (d: Difficulty) => void;
}

const CONFIG = {
  easy: {
    emoji: '🌱',
    label: '쉬움',
    stars: '⭐',
    grade: '초등 1~2학년',
    scenes: '5문제',
    hints: '5개',
    keyword: '블록 세기·투영도 입문',
    bg: 'linear-gradient(135deg, rgba(52,211,153,0.22) 0%, rgba(16,185,129,0.10) 100%)',
    border: 'rgba(52,211,153,0.45)',
    glow: 'card-emerald-glow',
    badge: { bg: '#065F46', text: '#34D399' },
    starColor: '#34D399',
  },
  medium: {
    emoji: '🏗',
    label: '보통',
    stars: '⭐⭐',
    grade: '초등 3~4학년',
    scenes: '6문제',
    hints: '3개',
    keyword: '복합 투영도·회전',
    bg: 'linear-gradient(135deg, rgba(56,189,248,0.22) 0%, rgba(14,165,233,0.10) 100%)',
    border: 'rgba(56,189,248,0.45)',
    glow: 'card-blue-glow',
    badge: { bg: '#0C4A6E', text: '#38BDF8' },
    starColor: '#38BDF8',
  },
  hard: {
    emoji: '🏰',
    label: '어려움',
    stars: '⭐⭐⭐',
    grade: '초등 5~6학년',
    scenes: '7문제',
    hints: '2개',
    keyword: '전개도·겉넓이·복합',
    bg: 'linear-gradient(135deg, rgba(192,132,252,0.25) 0%, rgba(168,85,247,0.12) 100%)',
    border: 'rgba(192,132,252,0.50)',
    glow: 'card-purple-glow',
    badge: { bg: '#3B0764', text: '#C084FC' },
    starColor: '#C084FC',
  },
} as const;

export function DifficultyCard({ difficulty, selected, onSelect }: Props) {
  const c = CONFIG[difficulty];

  return (
    <motion.button
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(difficulty)}
      className={`
        relative flex flex-col items-center gap-4 p-6 rounded-3xl border-2
        cursor-pointer text-center transition-all duration-200 w-full
        ${selected ? c.glow : ''}
      `}
      style={{
        background: c.bg,
        borderColor: selected ? '#FFD700' : c.border,
        boxShadow: selected
          ? `0 0 0 3px rgba(255,215,0,0.35), 0 0 40px rgba(255,215,0,0.15)`
          : undefined,
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* 선택 뱃지 */}
      {selected && (
        <motion.div
          layoutId="diff-badge"
          initial={false}
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black"
          style={{ background: '#FFD700', color: '#1A0A3C' }}
        >
          ✓ 선택됨
        </motion.div>
      )}

      {/* 이모지 */}
      <motion.span
        className="text-5xl"
        animate={selected ? { rotate: [0, -8, 8, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        {c.emoji}
      </motion.span>

      {/* 별 + 이름 */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-2xl tracking-wider">{c.stars}</span>
        <span
          className="text-2xl font-black"
          style={{ color: selected ? '#FFD700' : c.starColor }}
        >
          {c.label}
        </span>
      </div>

      {/* 설명 */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-white/90 text-sm font-semibold">{c.grade}</span>
        <span
          className="text-xs px-3 py-0.5 rounded-full font-medium"
          style={{ background: c.badge.bg, color: c.badge.text }}
        >
          {c.keyword}
        </span>
        <div className="flex gap-3 text-xs text-white/40 mt-1">
          <span>📝 {c.scenes}</span>
          <span>💡 힌트 {c.hints}</span>
        </div>
      </div>
    </motion.button>
  );
}
