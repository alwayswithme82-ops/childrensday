import { motion } from 'framer-motion';
import type { Difficulty } from '../../types/game';

interface Props { difficulty: Difficulty; selected: boolean; onSelect: (d: Difficulty) => void; }

const CFG = {
  easy: {
    icon: '🌱', label: '새싹 모험', sub: '처음 하는 친구 추천',
    scenes: 5, hints: 5, stars: '⭐',
    gradient: 'linear-gradient(145deg,#E8FFF3,#C6F7DC)',
    border: '#6BCB77',
    activeBg: 'linear-gradient(145deg,#6BCB77,#4CAF63)',
    textColor: '#2D7A3A',
  },
  medium: {
    icon: '🚀', label: '용사 모험', sub: '퍼즐을 좋아하는 친구 추천',
    scenes: 6, hints: 3, stars: '⭐⭐',
    gradient: 'linear-gradient(145deg,#EEF4FF,#DBEAFE)',
    border: '#4D96FF',
    activeBg: 'linear-gradient(145deg,#4D96FF,#2563EB)',
    textColor: '#1A4FB5',
  },
  hard: {
    icon: '🔥', label: '마법사 도전', sub: '진짜 큐브 고수 도전',
    scenes: 7, hints: 2, stars: '⭐⭐⭐',
    gradient: 'linear-gradient(145deg,#FFF0F5,#FFD6E7)',
    border: '#FF6B6B',
    activeBg: 'linear-gradient(145deg,#FF6B6B,#E53E3E)',
    textColor: '#C0392B',
  },
} as const;

export function DifficultyCard({ difficulty, selected, onSelect }: Props) {
  const c = CFG[difficulty];

  return (
    <motion.button
      whileHover={{ y: -6, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(difficulty)}
      className="relative w-full text-left cursor-pointer rounded-3xl p-5 flex flex-col gap-4 transition-all duration-200"
      style={{
        background: selected ? c.activeBg : c.gradient,
        border: `3px solid ${selected ? c.border : 'transparent'}`,
        boxShadow: selected
          ? `0 12px 32px ${c.border}55`
          : `0 4px 16px rgba(0,0,0,0.07)`,
      }}
    >
      {selected && (
        <motion.div
          layoutId="sel-badge"
          className="absolute -top-3.5 left-4 px-3 py-0.5 rounded-full text-xs font-900 bg-white shadow-md"
          style={{ color: c.textColor }}
        >
          ✓ 선택!
        </motion.div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-4xl">{c.icon}</span>
        <span
          className="text-xs font-900 px-2.5 py-1 rounded-full"
          style={{
            background: selected ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.8)',
            color: selected ? '#fff' : c.textColor,
          }}
        >
          {c.stars}
        </span>
      </div>

      <div>
        <p
          className="font-fredoka text-3xl leading-none mb-1"
          style={{ color: selected ? '#fff' : '#1a1a2e' }}
        >
          {c.label}
        </p>
        <p className="text-sm font-700" style={{ color: selected ? 'rgba(255,255,255,0.8)' : '#888' }}>
          {c.sub}
        </p>
      </div>

      <div
        className="h-px w-full"
        style={{ background: selected ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.06)' }}
      />

      <div className="flex items-center justify-between text-xs font-800"
        style={{ color: selected ? 'rgba(255,255,255,0.75)' : '#aaa' }}>
        <span>📝 {c.scenes}문제</span>
        <span>💡 힌트 {c.hints}개</span>
      </div>
    </motion.button>
  );
}
