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
    scenes: 5, hints: 5,
    bg: '#E8FFF3', border: '#6BCB77', accent: '#2d8f3e',
    selectedBg: '#6BCB77', badge: '입문',
  },
  medium: {
    icon: '🚀', label: '보통', sub: '초등 3·4학년',
    scenes: 6, hints: 3,
    bg: '#EEF4FF', border: '#4D96FF', accent: '#1a5fbf',
    selectedBg: '#4D96FF', badge: '도전',
  },
  hard: {
    icon: '🔥', label: '어려움', sub: '초등 5·6학년',
    scenes: 7, hints: 2,
    bg: '#FFF0F5', border: '#FF6B6B', accent: '#c0392b',
    selectedBg: '#FF6B6B', badge: '고급',
  },
} as const;

const STARS: Record<string, string> = { easy: '⭐', medium: '⭐⭐', hard: '⭐⭐⭐' };

export function DifficultyCard({ difficulty, selected, onSelect }: Props) {
  const c = CFG[difficulty];
  return (
    <motion.button
      whileHover={{ y: -6, scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onSelect(difficulty)}
      className="relative w-full text-left cursor-pointer rounded-3xl p-5 transition-all duration-200"
      style={{
        background: selected ? c.selectedBg : c.bg,
        border: `3px solid ${selected ? c.selectedBg : c.border}`,
        boxShadow: selected
          ? `0 8px 24px ${c.border}55`
          : `0 4px 12px ${c.border}22`,
      }}
    >
      {/* 선택 뱃지 */}
      {selected && (
        <motion.div
          layoutId="sel"
          className="absolute -top-3 left-4 bg-white text-xs font-900 px-3 py-0.5 rounded-full shadow-md"
          style={{ color: c.accent }}
        >
          ✓ 선택됨!
        </motion.div>
      )}

      {/* 아이콘 + 뱃지 */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-4xl">{c.icon}</span>
        <span
          className="text-xs font-900 px-2.5 py-1 rounded-full"
          style={{
            background: selected ? 'rgba(255,255,255,0.3)' : c.border + '22',
            color: selected ? '#fff' : c.accent,
          }}
        >
          {c.badge}
        </span>
      </div>

      {/* 이름 */}
      <p
        className="font-fredoka text-2xl mb-0.5"
        style={{ color: selected ? '#fff' : '#1a1a2e' }}
      >
        {c.label}
      </p>
      <p className="text-xs font-700" style={{ color: selected ? 'rgba(255,255,255,0.8)' : '#888' }}>
        {c.sub}
      </p>

      {/* 구분 */}
      <div className="my-3" style={{ height: 1, background: selected ? 'rgba(255,255,255,0.25)' : c.border + '33' }} />

      {/* 스탯 */}
      <div className="flex items-center justify-between">
        <span className="text-lg">{STARS[difficulty]}</span>
        <span className="text-xs font-700" style={{ color: selected ? 'rgba(255,255,255,0.75)' : '#aaa' }}>
          📝{c.scenes}문제 · 💡{c.hints}힌트
        </span>
      </div>
    </motion.button>
  );
}
