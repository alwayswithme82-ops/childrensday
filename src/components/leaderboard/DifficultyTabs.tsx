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
    <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(0,0,0,0.05)' }}>
      {TABS.map(d => {
        const cfg = DIFFICULTY_CONFIG[d];
        return (
          <button
            key={d}
            onClick={() => onChange(d)}
            className={`relative flex-1 py-2 px-3 rounded-lg text-sm font-700 transition-colors font-fredoka ${active === d ? cfg.color : ''}`}
            style={{ color: active === d ? undefined : '#aaa' }}
          >
            {active === d && (
              <motion.div
                layoutId="tab-bg"
                className="absolute inset-0 rounded-lg"
                style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              />
            )}
            <span className="relative">{cfg.label}</span>
          </button>
        );
      })}
    </div>
  );
}
