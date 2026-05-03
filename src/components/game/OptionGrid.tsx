import { memo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Option } from '../../types/game';

interface Props {
  options: Option[];
  onSelect: (optionId: string) => void;
  selectedId: string | null;
  correctId: string;
  showResult: boolean;
  directionLabel?: string;
}

const CELL = 24;

const MiniProjectionCanvas = memo(function MiniProjectionCanvas({ data }: { data: number[][] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rows = data.length;
  const cols = data[0]?.length ?? 0;

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !rows || !cols) return;
    ctx.clearRect(0, 0, cols * CELL, rows * CELL);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        ctx.fillStyle = data[r][c] ? '#4D96FF' : '#1e293b';
        ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.strokeRect(c * CELL + 0.5, r * CELL + 0.5, CELL - 1, CELL - 1);
      }
    }
  }, [data, rows, cols]);

  if (!rows || !cols) return null;

  return (
    <canvas
      ref={canvasRef}
      width={cols * CELL}
      height={rows * CELL}
      style={{ display: 'block', imageRendering: 'pixelated' }}
    />
  );
});

export function OptionGrid({ options, onSelect, selectedId, correctId, showResult, directionLabel }: Props) {
  const disabled = !!selectedId;

  return (
    <div className="flex flex-col gap-3">
      {directionLabel && (
        <div className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-center text-sm font-bold text-gold">
          {directionLabel} 고르기
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        {options.map(opt => {
          const isSelected = selectedId === opt.id;
          const isCorrect = opt.id === correctId;
          const showCorrect = showResult && isSelected && isCorrect;
          const showWrong = showResult && isSelected && !isCorrect;

          let ringClass = '';
          let bgClass = 'bg-slate-800';
          if (showCorrect) { ringClass = 'ring-2 ring-emerald-500'; bgClass = 'bg-emerald-500/20'; }
          if (showWrong) { ringClass = 'ring-2 ring-red-500'; bgClass = 'bg-red-500/20'; }

          return (
            <motion.button
              key={opt.id}
              animate={showWrong ? { x: [0, -8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              whileHover={!disabled ? { scale: 1.03 } : {}}
              whileTap={!disabled ? { scale: 0.97 } : {}}
              onClick={() => !disabled && onSelect(opt.id)}
              disabled={disabled}
              aria-label={`선택지 ${opt.id}${opt.label ? `: ${opt.label}` : ''}${showResult && isSelected ? (isCorrect ? ' — 정답' : ' — 오답') : ''}`}
              aria-pressed={isSelected}
              className={[
                'relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-transparent transition-all min-h-[88px] cursor-pointer',
                bgClass, ringClass,
                !disabled ? 'hover:ring-2 hover:ring-yellow-400/60' : '',
                !isSelected && disabled ? 'opacity-40' : '',
              ].join(' ')}
            >
              <span className="text-xs font-bold text-slate-500">{opt.id}</span>
              {directionLabel && opt.projectionData && (
                <span className="text-[11px] font-bold text-slate-400">{directionLabel}</span>
              )}
              {opt.projectionData ? (
                <MiniProjectionCanvas data={opt.projectionData} />
              ) : (
                <span className="text-sm font-bold text-white">{opt.label}</span>
              )}
              <AnimatePresence>
                {isSelected && showResult && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute inset-0 flex items-center justify-center rounded-xl"
                  >
                    <span className="text-3xl">{isCorrect ? '✅' : '❌'}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
