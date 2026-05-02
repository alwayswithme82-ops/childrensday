import { motion } from 'framer-motion';
import type { Difficulty } from '../../types/game';

interface Props {
  difficulty: Difficulty;
  selected: boolean;
  onSelect: (d: Difficulty) => void;
}

const CONFIG = {
  easy: {
    icon: '🌿',
    label: '쉬움',
    eng: 'EASY',
    grade: '초등 1 · 2학년',
    scenes: 5,
    hints: 5,
    tag: '투영도 입문',
    accent: '#059669',
    accentBg: 'rgba(5,150,105,0.08)',
    accentBorder: 'rgba(5,150,105,0.25)',
    accentSelected: 'rgba(5,150,105,0.15)',
  },
  medium: {
    icon: '⚙️',
    label: '보통',
    eng: 'NORMAL',
    grade: '초등 3 · 4학년',
    scenes: 6,
    hints: 3,
    tag: '복합 투영도',
    accent: '#2563EB',
    accentBg: 'rgba(37,99,235,0.08)',
    accentBorder: 'rgba(37,99,235,0.25)',
    accentSelected: 'rgba(37,99,235,0.12)',
  },
  hard: {
    icon: '🔥',
    label: '어려움',
    eng: 'HARD',
    grade: '초등 5 · 6학년',
    scenes: 7,
    hints: 2,
    tag: '최고 난이도',
    accent: '#7C3AED',
    accentBg: 'rgba(124,58,237,0.08)',
    accentBorder: 'rgba(124,58,237,0.25)',
    accentSelected: 'rgba(124,58,237,0.12)',
  },
} as const;

const STARS: Record<string, string> = { easy: '⭐', medium: '⭐⭐', hard: '⭐⭐⭐' };

export function DifficultyCard({ difficulty, selected, onSelect }: Props) {
  const c = CONFIG[difficulty];

  return (
    <motion.button
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(difficulty)}
      className="relative flex flex-col gap-4 p-5 rounded-2xl cursor-pointer text-left w-full transition-all duration-200"
      style={{
        background: selected ? c.accentSelected : 'rgba(255,255,255,0.85)',
        border: `2px solid ${selected ? c.accent : c.accentBorder}`,
        boxShadow: selected
          ? `0 0 0 3px ${c.accentBg}, 0 8px 32px ${c.accentBg}`
          : '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      {/* 선택 뱃지 */}
      {selected && (
        <motion.div
          layoutId="sel-badge"
          initial={false}
          className="absolute -top-3 left-4 px-3 py-0.5 rounded-full text-xs font-black text-white"
          style={{ background: c.accent }}
        >
          ✓ 선택됨
        </motion.div>
      )}

      {/* 아이콘 + 태그 */}
      <div className="flex items-start justify-between">
        <span className="text-3xl">{c.icon}</span>
        <span
          className="text-xs font-black px-2 py-0.5 rounded-full"
          style={{ background: c.accentBg, color: c.accent }}
        >
          {c.tag}
        </span>
      </div>

      {/* 이름 */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest mb-0.5" style={{ color: 'rgba(0,0,0,0.3)' }}>
          {c.eng}
        </p>
        <p className="text-2xl font-black" style={{ color: selected ? c.accent : '#1C1917' }}>
          {c.label}
        </p>
        <p className="text-xs font-semibold mt-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>
          {c.grade}
        </p>
      </div>

      {/* 구분 */}
      <div style={{ height: 1, background: 'rgba(0,0,0,0.07)' }} />

      {/* 스탯 */}
      <div className="flex items-center justify-between">
        <span className="text-base">{STARS[difficulty]}</span>
        <div className="flex gap-3 text-xs font-bold" style={{ color: 'rgba(0,0,0,0.35)' }}>
          <span>📝 {c.scenes}문제</span>
          <span>💡 {c.hints}개</span>
        </div>
      </div>
    </motion.button>
  );
}
