import { LayoutGroup, motion } from 'framer-motion';
import type { Difficulty } from '../../types/game';
import { DIFFICULTY_CONFIG } from '../../utils/constants';

interface Props {
  active: Difficulty;
  onChange: (d: Difficulty) => void;
}

const TABS: Difficulty[] = ['easy', 'medium', 'hard'];

export function DifficultyTabs({ active, onChange }: Props) {
  return (
    <LayoutGroup>
      <div className="flex gap-2">
        {TABS.map(d => {
          const cfg = DIFFICULTY_CONFIG[d];
          const isActive = active === d;

          return (
            <button
              key={d}
              onClick={() => onChange(d)}
              className="relative flex-1 px-6 py-3 rounded-xl font-medium text-sm transition-colors"
              style={{
                color: isActive ? '#1B2A4A' : undefined,
              }}
            >
              {/* 미선택 배경 */}
              {!isActive && (
                <span
                  className="absolute inset-0 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
                  aria-hidden
                />
              )}

              {/* 선택 배경 (layoutId로 슬라이드) */}
              {isActive && (
                <motion.span
                  layoutId="tab-indicator"
                  className="absolute inset-0 rounded-xl bg-gold"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  aria-hidden
                />
              )}

              {/* 텍스트 */}
              <span
                className="relative z-10 font-bold"
                style={{ color: isActive ? '#1B2A4A' : '#94A3B8' }}
              >
                {cfg.label}
              </span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
