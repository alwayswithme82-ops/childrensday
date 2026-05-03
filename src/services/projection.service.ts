import type { CubeData } from '../types/game';

type Grid = number[][];
type ColorGrid = string[][];

function makeGrid(rows: number, cols: number): Grid {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
}

function makeColorGrid(rows: number, cols: number): ColorGrid {
  return Array.from({ length: rows }, () => Array(cols).fill(''));
}

// --- Legacy fixed-size projections (used by existing projectionData option grids) ---

export function getFrontProjection(cubes: CubeData[], gridSize = 4): Grid {
  const grid = makeGrid(gridSize, gridSize);
  cubes.forEach(({ x, y }) => {
    const row = gridSize - 1 - y;
    const col = x;
    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) grid[row][col] = 1;
  });
  return grid;
}

export function getSideProjection(cubes: CubeData[], gridSize = 4): Grid {
  const grid = makeGrid(gridSize, gridSize);
  cubes.forEach(({ z, y }) => {
    const row = gridSize - 1 - y;
    const col = z;
    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) grid[row][col] = 1;
  });
  return grid;
}

export function getTopProjection(cubes: CubeData[], gridSize = 4): Grid {
  const grid = makeGrid(gridSize, gridSize);
  cubes.forEach(({ x, z }) => {
    const row = z;
    const col = x;
    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) grid[row][col] = 1;
  });
  return grid;
}

// --- New dynamic-size projections ---

/**
 * Calculates a binary projection grid sized to the actual bounding box of the cubes.
 * front: looking along -z → columns=x, rows=y (flipped so y=0 at bottom)
 * side:  looking along -x → columns=z, rows=y (flipped)
 * top:   looking along -y → columns=x, rows=z
 */
export function calculateProjection(
  cubes: CubeData[],
  face: 'front' | 'side' | 'top',
): Grid {
  const colorGrid = calculateColorProjection(cubes, face);
  return colorGrid.map(row => row.map(cell => (cell ? 1 : 0)));
}

/**
 * Color projection: each cell shows the color of the first visible cube.
 * front: smallest z wins  |  side: smallest x wins  |  top: largest y wins
 */
export function calculateColorProjection(
  cubes: CubeData[],
  face: 'front' | 'side' | 'top',
): ColorGrid {
  if (!cubes.length) return [['']];

  if (face === 'front') {
    const maxCol = Math.max(...cubes.map(c => c.x));
    const maxRow = Math.max(...cubes.map(c => c.y));
    const rows = maxRow + 1;
    const cols = maxCol + 1;
    const grid = makeColorGrid(rows, cols);
    const depth = Array.from({ length: rows }, () => Array<number>(cols).fill(Infinity));
    cubes.forEach(c => {
      const r = maxRow - c.y;
      const col = c.x;
      if (r >= 0 && r < rows && col >= 0 && col < cols && c.z < depth[r][col]) {
        depth[r][col] = c.z;
        grid[r][col] = c.color;
      }
    });
    return grid;
  }

  if (face === 'side') {
    const maxCol = Math.max(...cubes.map(c => c.z));
    const maxRow = Math.max(...cubes.map(c => c.y));
    const rows = maxRow + 1;
    const cols = maxCol + 1;
    const grid = makeColorGrid(rows, cols);
    const depth = Array.from({ length: rows }, () => Array<number>(cols).fill(Infinity));
    cubes.forEach(c => {
      const r = maxRow - c.y;
      const col = c.z;
      if (r >= 0 && r < rows && col >= 0 && col < cols && c.x < depth[r][col]) {
        depth[r][col] = c.x;
        grid[r][col] = c.color;
      }
    });
    return grid;
  }

  // top
  const maxCol = Math.max(...cubes.map(c => c.x));
  const maxRow = Math.max(...cubes.map(c => c.z));
  const rows = maxRow + 1;
  const cols = maxCol + 1;
  const grid = makeColorGrid(rows, cols);
  const depth = Array.from({ length: rows }, () => Array<number>(cols).fill(-Infinity));
  cubes.forEach(c => {
    const r = c.z;
    const col = c.x;
    if (r >= 0 && r < rows && col >= 0 && col < cols && c.y > depth[r][col]) {
      depth[r][col] = c.y;
      grid[r][col] = c.color;
    }
  });
  return grid;
}
