import { motion } from 'framer-motion';
import type { Difficulty } from '../../types/game';
import { DIFFICULTY_CONFIG } from '../../utils/constants';

interface Props {
  difficulty: Difficulty;
  selected: boolean;
  onSelect: (d: Difficulty) => void;
}

const descriptions: Record<Difficulty, string> = {
  easy:   '초등 1~2학년\n기본 투영도 5문제',
  medium: '초등 3~4학년\n복합 투영도 6문제',
  hard:   '초등 5~6학년\n최고 난이도 7문제',
};

export function DifficultyCard({ difficulty, selected, onSelect }: Props) {
  const cfg = DIFFICULTY_CONFIG[difficulty];
  const stars = '⭐'.repeat(cfg.stars);

  return (
    <motion.button
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(difficulty)}
      className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer w-40 md:w-48
        ${selected
          ? `border-yellow-400 bg-gradient-to-b ${cfg.bg} ring-4 ring-yellow-400/30`
          : 'border-white/20 bg-white/5 hover:border-white/40'
        }`}
    >
      {selected && (
        <motion.div
          layoutId="selected-badge"
          className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-0.5 rounded-full"
        >
          선택됨
        </motion.div>
      )}
      <span className="text-3xl">{stars}</span>
      <span className={`font-bold text-lg ${cfg.color}`}>{cfg.label}</span>
      <p className="text-white/60 text-xs text-center whitespace-pre-line leading-relaxed">
        {descriptions[difficulty]}
      </p>
      <div className="flex gap-1 mt-1">
        <span className="text-xs text-white/40">💡 힌트 {cfg.hints}개</span>
      </div>
    </motion.button>
  );
}
