import { useEffect, useRef } from 'react';
import type { CubeData } from '../../types/game';
import { useProjection } from '../../hooks/useProjection';

interface Props {
  cubes: CubeData[];
  faces: ('front' | 'side' | 'top')[];
}

const LABELS: Record<string, string> = { front: '앞면', side: '옆면', top: '윗면' };
const CELL = 40;

function ProjectionCanvas({ grid }: { grid: string[][] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !rows || !cols) return;

    const w = cols * CELL;
    const h = rows * CELL;
    ctx.clearRect(0, 0, w, h);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const color = grid[r][c];
        ctx.fillStyle = color || '#334155';
        ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.strokeRect(c * CELL + 0.5, r * CELL + 0.5, CELL - 1, CELL - 1);
      }
    }
  }, [grid, rows, cols]);

  if (!rows || !cols) return null;

  return (
    <canvas
      ref={canvasRef}
      width={cols * CELL}
      height={rows * CELL}
      style={{ display: 'block', imageRendering: 'pixelated' }}
    />
  );
}

export function ProjectionView({ cubes, faces }: Props) {
  const { frontView, sideView, topView } = useProjection(cubes);
  const views = { front: frontView, side: sideView, top: topView };

  return (
    <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4">
      {faces.map(face => (
        <div key={face} className="flex flex-col items-center gap-1.5 max-w-full">
          <span className="text-xs text-slate-400 font-medium">{LABELS[face]}</span>
          <div className="rounded-lg overflow-hidden border border-slate-700 max-w-full">
            <ProjectionCanvas grid={views[face]} />
          </div>
        </div>
      ))}
    </div>
  );
}
