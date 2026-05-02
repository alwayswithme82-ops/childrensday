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
    accent: '#10B981',
    accentBg: 'rgba(16,185,129,0.10)',
    accentBorder: 'rgba(16,185,129,0.30)',
    accentGlow: 'rgba(16,185,129,0.25)',
  },
  medium: {
    icon: '⚙️',
    label: '보통',
    eng: 'NORMAL',
    grade: '초등 3 · 4학년',
    scenes: 6,
    hints: 3,
    tag: '복합 투영도',
    accent: '#3B82F6',
    accentBg: 'rgba(59,130,246,0.10)',
    accentBorder: 'rgba(59,130,246,0.30)',
    accentGlow: 'rgba(59,130,246,0.25)',
  },
  hard: {
    icon: '🔥',
    label: '어려움',
    eng: 'HARD',
    grade: '초등 5 · 6학년',
    scenes: 7,
    hints: 2,
    tag: '최고 난이도',
    accent: '#A855F7',
    accentBg: 'rgba(168,85,247,0.10)',
    accentBorder: 'rgba(168,85,247,0.30)',
    accentGlow: 'rgba(168,85,247,0.30)',
  },
} as const;

const STAR_MAP: Record<string, string> = { easy: '⭐', medium: '⭐⭐', hard: '⭐⭐⭐' };

export function DifficultyCard({ difficulty, selected, onSelect }: Props) {
  const c = CONFIG[difficulty];

  return (
    <motion.button
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(difficulty)}
      className="relative flex flex-col gap-5 p-6 rounded-3xl cursor-pointer text-left w-full transition-all duration-200"
      style={{
        background: selected
          ? `linear-gradient(145deg, rgba(245,184,0,0.12) 0%, ${c.accentBg} 100%)`
          : `linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)`,
        border: `1.5px solid ${selected ? '#F5B800' : c.accentBorder}`,
        boxShadow: selected
          ? `0 0 0 3px rgba(245,184,0,0.20), 0 16px 48px ${c.accentGlow}`
          : `0 4px 24px rgba(0,0,0,0.3)`,
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* 선택 뱃지 */}
      <AnimatedBadge show={selected} />

      {/* 상단: 아이콘 + 태그 */}
      <div className="flex items-start justify-between">
        <span className="text-4xl">{c.icon}</span>
        <span
          className="text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider"
          style={{ background: c.accentBg, color: c.accent, border: `1px solid ${c.accentBorder}` }}
        >
          {c.tag}
        </span>
      </div>

      {/* 중단: 이름 */}
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {c.eng}
        </p>
        <p className="text-3xl font-black text-white">{c.label}</p>
        <p className="text-sm font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{c.grade}</p>
      </div>

      {/* 구분선 */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />

      {/* 하단: 스탯 */}
      <div className="flex items-center justify-between">
        <span className="text-lg">{STAR_MAP[difficulty]}</span>
        <div className="flex gap-3 text-xs font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <span>📝 {c.scenes}문제</span>
          <span>💡 힌트 {c.hints}</span>
        </div>
      </div>
    </motion.button>
  );
}

function AnimatedBadge({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <motion.div
      layoutId="selected-badge"
      initial={false}
      className="absolute -top-3 left-5 px-3 py-0.5 rounded-full text-xs font-black"
      style={{ background: '#F5B800', color: '#09090F' }}
    >
      ✓ 선택됨
    </motion.div>
  );
}
