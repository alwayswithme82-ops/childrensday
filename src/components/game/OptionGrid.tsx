import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Option } from '../../types/game';

interface Props {
  options: Option[];
  onAnswer: (correct: boolean, optionId: string) => void;
  disabled?: boolean;
}

const CELL = 20;

function MiniGrid({ data }: { data: number[][] }) {
  return (
    <div className="grid" style={{ gridTemplateColumns: `repeat(${data[0]?.length ?? 2}, ${CELL}px)` }}>
      {data.map((row, r) =>
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            style={{
              width: CELL, height: CELL,
              border: '1px solid rgba(0,0,0,0.1)',
              background: cell ? '#4D96FF' : 'rgba(0,0,0,0.03)',
            }}
          />
        ))
      )}
    </div>
  );
}

export function OptionGrid({ options, onAnswer, disabled = false }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = (opt: Option) => {
    if (disabled || selected) return;
    setSelected(opt.id);
    onAnswer(opt.correct, opt.id);
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map(opt => {
        const isSelected = selected === opt.id;
        const showResult = isSelected;
        const correct = opt.correct;

        return (
          <motion.button
            key={opt.id}
            whileHover={!selected ? { scale: 1.04 } : {}}
            whileTap={!selected ? { scale: 0.96 } : {}}
            onClick={() => handleClick(opt)}
            disabled={!!selected || disabled}
            className="relative flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all min-h-[80px]"
            style={{
              border: showResult && correct ? '2px solid #6BCB77'
                : showResult && !correct ? '2px solid #FF6B6B'
                : !selected ? '2px solid #E5E7EB'
                : '2px solid #E5E7EB',
              background: showResult && correct ? '#F0FFF4'
                : showResult && !correct ? '#FFF0F0'
                : !selected ? '#FFFFFF'
                : 'rgba(0,0,0,0.02)',
              opacity: !showResult && selected ? 0.5 : 1,
              cursor: selected ? 'default' : 'pointer',
              boxShadow: !selected ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            <span className="text-xs font-bold" style={{ color: '#ccc' }}>{opt.id}</span>
            {opt.projectionData ? (
              <MiniGrid data={opt.projectionData} />
            ) : (
              <span className="text-sm font-700" style={{ color: '#333' }}>{opt.label}</span>
            )}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center rounded-xl"
                >
                  <span className="text-3xl">{correct ? '✅' : '❌'}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
