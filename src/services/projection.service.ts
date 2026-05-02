import type { CubeData } from '../types/game';

type Grid = number[][];

function makeGrid(size: number): Grid {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

export function getFrontProjection(cubes: CubeData[], gridSize = 4): Grid {
  const grid = makeGrid(gridSize);
  cubes.forEach(({ x, y }) => {
    const row = gridSize - 1 - y;
    const col = x;
    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
      grid[row][col] = 1;
    }
  });
  return grid;
}

export function getSideProjection(cubes: CubeData[], gridSize = 4): Grid {
  const grid = makeGrid(gridSize);
  cubes.forEach(({ z, y }) => {
    const row = gridSize - 1 - y;
    const col = z;
    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
      grid[row][col] = 1;
    }
  });
  return grid;
}

export function getTopProjection(cubes: CubeData[], gridSize = 4): Grid {
  const grid = makeGrid(gridSize);
  cubes.forEach(({ x, z }) => {
    const row = z;
    const col = x;
    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
      grid[row][col] = 1;
    }
  });
  return grid;
}
