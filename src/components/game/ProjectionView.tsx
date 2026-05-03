import { useEffect, useRef } from 'react';
import type { CubeData } from '../../types/game';
import { getFrontProjection, getSideProjection, getTopProjection } from '../../services/projection.service';

interface Props {
  cubes: CubeData[];
  faces: ('front' | 'side' | 'top')[];
}

const LABELS: Record<string, string> = { front: '앞', side: '옆', top: '위' };
const CELL = 32;
const GRID = 4;

const COLORS: Record<string, string> = {
  front: '#3b82f6',
  side: '#22c55e',
  top: '#a855f7',
};

function drawGrid(ctx: CanvasRenderingContext2D, grid: number[][], color: string) {
  const size = GRID * CELL;
  ctx.clearRect(0, 0, size, size);
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      const x = c * CELL, y = r * CELL;
      if (grid[r]?.[c]) {
        ctx.fillStyle = color;
        ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, CELL, CELL);
    }
  }
}

export function ProjectionView({ cubes, faces }: Props) {
  const refs = {
    front: useRef<HTMLCanvasElement>(null),
    side: useRef<HTMLCanvasElement>(null),
    top: useRef<HTMLCanvasElement>(null),
  };

  useEffect(() => {
    const grids = {
      front: getFrontProjection(cubes),
      side: getSideProjection(cubes),
      top: getTopProjection(cubes),
    };
    faces.forEach(face => {
      const ctx = refs[face].current?.getContext('2d');
      if (ctx) drawGrid(ctx, grids[face], COLORS[face]);
    });
  }, [cubes, faces]);

  const size = GRID * CELL;

  return (
    <div className="flex gap-3">
      {faces.map(face => (
        <div key={face} className="flex-1 flex flex-col items-center gap-2">
          <span className="text-xs font-bold text-slate-400">{LABELS[face]}</span>
          <div className="w-full aspect-square bg-slate-800 rounded-xl flex items-center justify-center p-2">
            <canvas
              ref={refs[face]}
              width={size}
              height={size}
              style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
