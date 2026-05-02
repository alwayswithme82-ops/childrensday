import { motion } from 'framer-motion';
import type { Difficulty } from '../../types/game';
import { DIFFICULTY_CONFIG } from '../../utils/constants';

interface Props {
  active: Difficulty;
  onChange: (d: Difficulty) => void;
}

const TABS: Difficulty[] = ['easy', 'medium', 'hard'];

export function DifficultyTabs({ active, onChange }: Props) {
  return (
    <div className="flex gap-1 bg-white/5 p-1 rounded-xl">
      {TABS.map(d => {
        const cfg = DIFFICULTY_CONFIG[d];
        return (
          <button
            key={d}
            onClick={() => onChange(d)}
            className={`relative flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${active === d ? cfg.color : 'text-white/50 hover:text-white/80'}`}
          >
            {active === d && (
              <motion.div
                layoutId="tab-bg"
                className="absolute inset-0 bg-white/10 rounded-lg"
              />
            )}
            <span className="relative">{cfg.label}</span>
          </button>
        );
      })}
    </div>
  );
}
