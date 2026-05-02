import { useEffect, useRef } from 'react';
import type { CubeData } from '../../types/game';
import { getFrontProjection, getSideProjection, getTopProjection } from '../../services/projection.service';

interface Props {
  cubes: CubeData[];
  faces: ('front' | 'side' | 'top')[];
}

const LABELS: Record<string, string> = { front: '앞', side: '옆', top: '위' };
const CELL = 24;
const GRID = 4;

function drawGrid(ctx: CanvasRenderingContext2D, grid: number[][], color: string) {
  const size = GRID * CELL;
  ctx.clearRect(0, 0, size, size);
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1;
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      const x = c * CELL, y = r * CELL;
      if (grid[r]?.[c]) {
        ctx.fillStyle = color;
        ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
      }
      ctx.strokeRect(x, y, CELL, CELL);
    }
  }
}

export function ProjectionView({ cubes, faces }: Props) {
  const refs = { front: useRef<HTMLCanvasElement>(null), side: useRef<HTMLCanvasElement>(null), top: useRef<HTMLCanvasElement>(null) };

  useEffect(() => {
    const grids = {
      front: getFrontProjection(cubes),
      side:  getSideProjection(cubes),
      top:   getTopProjection(cubes),
    };
    const colors = { front: '#3b82f6', side: '#22c55e', top: '#a855f7' };
    faces.forEach(face => {
      const ctx = refs[face].current?.getContext('2d');
      if (ctx) drawGrid(ctx, grids[face], colors[face]);
    });
  }, [cubes, faces]);

  const size = GRID * CELL;

  return (
    <div className="flex gap-3 flex-wrap justify-center">
      {faces.map(face => (
        <div key={face} className="flex flex-col items-center gap-1">
          <span className="text-xs text-white/50 font-medium">{LABELS[face]}면</span>
          <canvas
            ref={refs[face]}
            width={size}
            height={size}
            className="rounded border border-white/10"
          />
        </div>
      ))}
    </div>
  );
}
