import type { ColorCell, ViewFace } from '../types/game';

export type ProjectionCell = ColorCell | number;
export type ProjectionGrid<T extends ProjectionCell> = T[][];

const SIDE_FACES = new Set<ViewFace>(['front', 'back', 'left', 'right']);

function emptyCell<T extends ProjectionCell>(sample: T | undefined): T {
  return (typeof sample === 'number' ? 0 : null) as T;
}

function isFilled(cell: ProjectionCell): boolean {
  return typeof cell === 'number' ? cell !== 0 : cell !== null && cell !== '';
}

function normalizeSizeTo3x3<T extends ProjectionCell>(
  grid: ProjectionGrid<T>,
  bottomAlignRows: boolean,
): ProjectionGrid<T> {
  const sample = grid.flat().find(cell => cell !== undefined);
  const out = Array.from({ length: 3 }, () => Array<T>(3).fill(emptyCell(sample)));
  const rowOffset = bottomAlignRows ? Math.max(0, 3 - Math.min(grid.length, 3)) : 0;

  for (let r = 0; r < Math.min(grid.length, 3); r++) {
    const row = grid[r] ?? [];
    const targetRow = rowOffset + r;
    for (let c = 0; c < Math.min(row.length, 3); c++) {
      out[targetRow][c] = row[c];
    }
  }

  return out;
}

export function normalizeProjectionTo3x3<T extends ProjectionCell>(
  grid: ProjectionGrid<T>,
  face: ViewFace,
): ProjectionGrid<T> {
  return normalizeSizeTo3x3(grid, SIDE_FACES.has(face));
}

export function validateProjectionGrounded<T extends ProjectionCell>(grid: ProjectionGrid<T>): boolean {
  const cells = normalizeSizeTo3x3(grid, true);

  for (let c = 0; c < 3; c++) {
    for (let r = 0; r < 3; r++) {
      if (!isFilled(cells[r][c])) continue;
      for (let below = r + 1; below < 3; below++) {
        if (!isFilled(cells[below][c])) return false;
      }
    }
  }

  return true;
}

export function isSideProjection(face: ViewFace): boolean {
  return SIDE_FACES.has(face);
}
