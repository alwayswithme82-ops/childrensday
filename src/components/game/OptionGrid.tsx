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
              border: '1px solid rgba(255,255,255,0.08)',
              background: cell ? '#4D96FF' : 'rgba(255,255,255,0.04)',
            }}
          />
        ))
      )}
    </div>
  );
}

const shakeVariant = {
  shake: { x: [0, -8, 8, -6, 6, -4, 4, 0] },
  still: { x: 0 },
};

export function OptionGrid({ options, onAnswer, disabled = false }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [shakingId, setShakingId] = useState<string | null>(null);

  const handleClick = (opt: Option) => {
    if (disabled || selected) return;
    setSelected(opt.id);
    if (!opt.correct) {
      setShakingId(opt.id);
      setTimeout(() => setShakingId(null), 450);
    }
    onAnswer(opt.correct, opt.id);
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map(opt => {
        const isSelected = selected === opt.id;
        const correct = opt.correct;

        let ring = '';
        let bg = 'bg-slate-800';
        if (isSelected && correct) {
          ring = 'ring-2 ring-emerald-500';
          bg = 'bg-emerald-500/20';
        } else if (isSelected && !correct) {
          ring = 'ring-2 ring-red-500';
          bg = 'bg-red-500/20';
        }

        return (
          <motion.button
            key={opt.id}
            variants={shakeVariant}
            animate={shakingId === opt.id ? 'shake' : 'still'}
            transition={{ duration: 0.4 }}
            whileHover={!selected ? { scale: 1.03 } : {}}
            whileTap={!selected ? { scale: 0.97 } : {}}
            onClick={() => handleClick(opt)}
            disabled={!!selected || disabled}
            className={[
              'relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-transparent transition-all min-h-[88px] cursor-pointer',
              bg, ring,
              !selected ? 'hover:ring-2 hover:ring-gold/60' : '',
              !isSelected && selected ? 'opacity-40' : '',
            ].join(' ')}
          >
            <span className="text-xs font-bold text-slate-500">{opt.id}</span>
            {opt.projectionData ? (
              <MiniGrid data={opt.projectionData} />
            ) : (
              <span className="text-sm font-bold text-white">{opt.label}</span>
            )}
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
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
