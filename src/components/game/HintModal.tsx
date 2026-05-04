import { useEffect, useState } from 'react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import type { HintStage } from '../../types/game';

interface Props {
  open: boolean;
  onClose: () => void;
  stages: HintStage[];
  hintsRemaining: number;
}

const FACE_LABEL: Record<NonNullable<HintStage['grid']>['face'], string> = {
  front: '앞에서 본 모습',
  back: '뒤에서 본 모습',
  top: '위에서 본 모습',
  left: '왼쪽에서 본 모습',
};

function ColorGrid({ cells }: { cells: (string | null)[][] }) {
  const rows = cells.length;
  const cols = cells[0]?.length ?? 0;
  return (
    <div
      className="inline-grid gap-1 rounded-lg border border-slate-700 bg-slate-950/70 p-2"
      style={{
        gridTemplateColumns: `repeat(${cols}, 28px)`,
        gridTemplateRows: `repeat(${rows}, 28px)`,
      }}
    >
      {cells.flatMap((row, r) =>
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            className="h-7 w-7 rounded"
            style={{
              background: cell ?? 'rgba(148,163,184,0.18)',
              border: cell
                ? '1px solid rgba(255,255,255,0.45)'
                : '1px solid rgba(255,255,255,0.10)',
              boxShadow: cell ? 'inset 0 -3px 0 rgba(0,0,0,0.18)' : 'none',
            }}
          />
        )),
      )}
    </div>
  );
}

export function HintModal({ open, onClose, stages, hintsRemaining }: Props) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  const safeStages = stages.length ? stages : [{ text: '힌트가 준비되지 않았어요.' }];
  const total = safeStages.length;
  const stage = safeStages[Math.min(step, total - 1)];
  const isLast = step >= total - 1;

  return (
    <Modal
      open={open}
      onClose={onClose}
      cardClassName="rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 shadow-2xl"
      cardStyle={{ background: '#1B2A4A', border: '1px solid rgba(245,158,11,0.25)' }}
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl">💡</span>
          <h2 className="font-fredoka text-xl text-gold">힌트 {step + 1} / {total}</h2>
          <span className="ml-auto text-sm text-white/40">남은 힌트: {hintsRemaining}개</span>
        </div>

        <p className="whitespace-pre-line break-keep leading-relaxed text-sm text-white/85">
          {stage.text}
        </p>

        {stage.grid && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs font-bold text-amber-200">
              {FACE_LABEL[stage.grid.face]} (예시)
            </p>
            <ColorGrid cells={stage.grid.cells} />
          </div>
        )}

        <div className="flex gap-2">
          {step > 0 && (
            <Button onClick={() => setStep(s => Math.max(0, s - 1))} variant="outline" className="flex-1">
              ← 이전
            </Button>
          )}
          {!isLast && (
            <Button onClick={() => setStep(s => Math.min(total - 1, s + 1))} className="flex-1">
              다음 힌트 →
            </Button>
          )}
          {isLast && (
            <Button onClick={onClose} className="flex-1">알겠어!</Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
