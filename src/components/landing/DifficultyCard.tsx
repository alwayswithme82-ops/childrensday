import { motion } from 'framer-motion';
import type { Difficulty } from '../../types/game';

interface Props {
  difficulty: Difficulty;
  selected: boolean;
  onSelect: (d: Difficulty) => void;
}

const CONFIG: Record<Difficulty, {
  stars: string;
  label: string;
  emoji: string;
  desc: string;
  scenes: string;
  gradient: string;
  border: string;
  glow: string;
  textColor: string;
}> = {
  easy: {
    stars: '⭐',
    label: '쉬움',
    emoji: '🌱',
    desc: '초등 1~2학년',
    scenes: '5문제',
    gradient: 'from-emerald-500/20 to-emerald-600/10',
    border: 'border-emerald-500/30',
    glow: 'shadow-[0_0_24px_rgba(16,185,129,0.3)]',
    textColor: 'text-emerald-400',
  },
  medium: {
    stars: '⭐⭐',
    label: '보통',
    emoji: '🏗',
    desc: '초등 3~4학년',
    scenes: '6문제',
    gradient: 'from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/30',
    glow: 'shadow-[0_0_24px_rgba(59,130,246,0.3)]',
    textColor: 'text-blue-400',
  },
  hard: {
    stars: '⭐⭐⭐',
    label: '어려움',
    emoji: '🏰',
    desc: '초등 5~6학년',
    scenes: '7문제',
    gradient: 'from-purple-500/20 to-purple-600/10',
    border: 'border-purple-500/30',
    glow: 'shadow-[0_0_24px_rgba(168,85,247,0.3)]',
    textColor: 'text-purple-400',
  },
};

export function DifficultyCard({ difficulty, selected, onSelect }: Props) {
  const cfg = CONFIG[difficulty];

  return (
    <motion.button
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(difficulty)}
      className={`
        relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2
        bg-gradient-to-b ${cfg.gradient} ${cfg.border}
        transition-all duration-200 cursor-pointer text-left w-full
        ${selected
          ? `ring-2 ring-gold scale-[1.03] ${cfg.glow}`
          : 'hover:border-opacity-60'
        }
      `}
    >
      {/* 선택 뱃지 */}
      {selected && (
        <motion.div
          layoutId="difficulty-badge"
          className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-navy text-xs font-black px-3 py-0.5 rounded-full"
        >
          선택됨 ✓
        </motion.div>
      )}

      {/* 이모지 */}
      <span className="text-4xl">{cfg.emoji}</span>

      {/* 별 + 난이도 */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-lg">{cfg.stars}</span>
        <span className={`text-2xl font-black ${cfg.textColor}`}>{cfg.label}</span>
      </div>

      {/* 설명 */}
      <div className="flex flex-col items-center gap-0.5 text-center">
        <span className="text-slate-300 text-sm font-medium">{cfg.desc}</span>
        <span className="text-slate-500 text-xs">{cfg.scenes} · 힌트 제공</span>
      </div>
    </motion.button>
  );
}
