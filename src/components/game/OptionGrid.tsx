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
            className={`w-5 h-5 border border-white/10 ${cell ? 'bg-yellow-400' : 'bg-white/5'}`}
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
            className={`relative flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all min-h-[80px]
              ${!selected ? 'border-white/20 bg-white/5 hover:border-yellow-400/50 hover:bg-white/10 cursor-pointer' : ''}
              ${showResult && correct ? 'border-green-400 bg-green-900/40' : ''}
              ${showResult && !correct ? 'border-red-400 bg-red-900/40' : ''}
              ${!showResult && selected ? 'border-white/10 bg-white/5 opacity-50' : ''}
            `}
          >
            <span className="text-xs font-bold text-white/40">{opt.id}</span>
            {opt.projectionData ? (
              <MiniGrid data={opt.projectionData} />
            ) : (
              <span className="text-white font-semibold text-sm">{opt.label}</span>
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
