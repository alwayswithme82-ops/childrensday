import { motion } from 'framer-motion';
import type { Difficulty } from '../../types/game';
import { DIFFICULTY_CONFIG } from '../../utils/constants';

interface Props { active: Difficulty; onChange: (d: Difficulty) => void; }
const TABS: Difficulty[] = ['easy', 'medium', 'hard'];

export function DifficultyTabs({ active, onChange }: Props) {
  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
      {TABS.map(d => (
        <button
          key={d}
          onClick={() => onChange(d)}
          className="relative flex-1 py-2 px-3 rounded-lg text-sm font-800 transition-colors"
          style={{ color: active === d ? '#D97706' : '#9CA3AF' }}
        >
          {active === d && (
            <motion.div layoutId="tab-pill"
              className="absolute inset-0 bg-white rounded-lg shadow-sm" style={{ zIndex: 0 }} />
          )}
          <span className="relative z-10">{DIFFICULTY_CONFIG[d].label}</span>
        </button>
      ))}
    </div>
  );
}
