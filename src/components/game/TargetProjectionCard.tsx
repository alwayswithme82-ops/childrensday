import { useEffect, useRef } from 'react';
import type { TargetProjections } from '../../types/game';

const LABELS: Record<keyof TargetProjections, { title: string; sub: string }> = {
  front: { title: '앞에서 본 모습', sub: '문 앞에서 바라본 그림자' },
  top: { title: '위에서 본 모습', sub: '하늘에서 내려다본 모습' },
  side: { title: '왼쪽에서 본 모습', sub: '왼쪽 길에서 바라본 그림자' },
};

const CELL = 28;

function ProjectionCanvas({ grid }: { grid: number[][] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !rows || !cols) return;
    ctx.clearRect(0, 0, cols * CELL, rows * CELL);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        ctx.fillStyle = grid[r][c] ? '#F59E0B' : '#1e293b';
        ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.strokeRect(c * CELL + 0.5, r * CELL + 0.5, CELL - 1, CELL - 1);
      }
    }
  }, [grid, rows, cols]);

  return (
    <canvas
      ref={canvasRef}
      width={cols * CELL}
      height={rows * CELL}
      style={{ display: 'block', imageRendering: 'pixelated' }}
    />
  );
}

interface Props {
  targets: TargetProjections;
  exactCubes?: number;
  minCubes?: number;
  maxCubes?: number;
  currentCubes: number;
}

export function TargetProjectionCard({ targets, exactCubes, minCubes, maxCubes, currentCubes }: Props) {
  const faces = (['front', 'top', 'side'] as Array<keyof TargetProjections>).filter(face => targets[face]);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/85 p-4 shadow-lg">
      <p className="text-xs font-bold uppercase tracking-wide text-gold">목표 조건</p>
      <div className="mt-4 grid gap-3">
        {faces.map(face => (
          <div key={face} className="rounded-xl bg-slate-950/70 p-3">
            <div className="mb-2">
              <p className="text-sm font-bold text-white">{LABELS[face].title}</p>
              <p className="text-xs text-slate-400">{LABELS[face].sub}</p>
            </div>
            <div className="inline-block overflow-hidden rounded-lg border border-slate-700">
              <ProjectionCanvas grid={targets[face] ?? []} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-gold/10 px-3 py-2 text-sm font-bold text-gold">
        사용할 큐브 수: {exactCubes ? `${exactCubes}개` : `${minCubes ?? 0}~${maxCubes ?? '-'}개`}
        <br />
        현재 사용한 큐브 수: {currentCubes}개
      </div>
    </div>
  );
}
