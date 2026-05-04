import { useState } from 'react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import type { HintStage } from '../../types/game';
import {
  isSideProjection,
  normalizeProjectionTo3x3,
  validateProjectionGrounded,
} from '../../utils/projectionGrid';
import { CUBE_COLOR_HEX } from '../../utils/constants';

interface Props {
  open: boolean;
  onClose: () => void;
  stages: HintStage[];
  hintsRemaining: number;
  missionId?: number;
}

const FACE_LABEL: Record<NonNullable<HintStage['grid']>['face'], string> = {
  front: '앞에서 본 모습',
  back: '뒤에서 본 모습',
  top: '위에서 본 모습',
  left: '왼쪽에서 본 모습',
  right: '오른쪽에서 본 모습',
};

function ColorGrid({
  cells: rawCells,
  face,
  missionId,
  cellSize = 28,
  normalize = true,
}: {
  cells: (string | null)[][];
  face: NonNullable<HintStage['grid']>['face'];
  missionId?: number;
  cellSize?: number;
  normalize?: boolean;
}) {
  if (normalize && import.meta.env.DEV && isSideProjection(face) && !validateProjectionGrounded(rawCells)) {
    console.warn(`[HintValidation] Floating projection detected in mission ${missionId ?? 'unknown'}, face ${face}`);
  }

  const cells = normalize ? normalizeProjectionTo3x3(rawCells, face) : rawCells;
  const rows = cells.length;
  const cols = cells[0]?.length ?? 0;
  return (
    <div
      className="inline-grid gap-1 rounded-lg border border-slate-700 bg-slate-950/70 p-2"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
      }}
    >
      {cells.flatMap((row, r) =>
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            className="rounded"
            style={{
              width: cellSize,
              height: cellSize,
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

const _ = null;
const MISSION_2_TOP = [
  [CUBE_COLOR_HEX.red, CUBE_COLOR_HEX.blue, _],
  [_, CUBE_COLOR_HEX.yellow, _],
  [_, _, _],
];
const MISSION_2_FRONT = [
  [_, _, _],
  [_, _, _],
  [CUBE_COLOR_HEX.red, CUBE_COLOR_HEX.blue, _],
];
const MISSION_2_BAD_FRONT = [
  [_, _, _],
  [_, CUBE_COLOR_HEX.yellow, _],
  [CUBE_COLOR_HEX.red, CUBE_COLOR_HEX.blue, _],
];

function Mission2HideHint() {
  return (
    <div className="rounded-2xl border border-amber-300/25 bg-slate-950/35 p-3">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-bold text-emerald-200">위에서 본 모습</p>
          <ColorGrid cells={MISSION_2_TOP} face="top" cellSize={42} normalize={false} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-bold text-emerald-200">앞에서 본 모습</p>
          <ColorGrid cells={MISSION_2_FRONT} face="front" cellSize={42} normalize={false} />
        </div>
      </div>
      <p className="mt-3 break-keep text-sm font-bold leading-relaxed text-white/85">
        노랑 큐브는 파랑 큐브의 “뒤쪽 바닥”에 놓아야 해요.
        파랑 큐브 위에 올리면 앞에서 노랑이 보여요.
      </p>
      <div className="mt-4 rounded-xl border border-red-300/25 bg-red-500/10 p-3">
        <p className="mb-2 text-xs font-bold text-red-200">이건 안 돼요</p>
        <div className="flex flex-col items-center gap-2">
          <ColorGrid cells={MISSION_2_BAD_FRONT} face="front" cellSize={42} normalize={false} />
          <p className="break-keep text-xs font-bold text-red-100/90">
            노랑이 파랑 위에 있으면 앞에서 보여요.
          </p>
        </div>
      </div>
    </div>
  );
}

export function HintModal({ open, onClose, stages, hintsRemaining, missionId }: Props) {
  const [step, setStep] = useState(0);

  const safeStages = stages.length ? stages : [{ text: '힌트가 준비되지 않았어요.' }];
  const total = safeStages.length;
  const stage = safeStages[Math.min(step, total - 1)];
  const isLast = step >= total - 1;
  const handleClose = () => {
    setStep(0);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
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
            <ColorGrid cells={stage.grid.cells} face={stage.grid.face} missionId={missionId} />
            {isSideProjection(stage.grid.face) && (
              <p className="text-[11px] font-bold text-slate-300">
                큐브는 바닥부터 차곡차곡 쌓여요.
              </p>
            )}
          </div>
        )}

        {missionId === 2 && step === total - 1 && <Mission2HideHint />}

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
            <Button onClick={handleClose} className="flex-1">알겠어!</Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
