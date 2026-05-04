import type { CubeData, Scene, TargetProjections } from '../types/game';
import {
  calculateColorProjection as calculateBuildColorProjection,
  calculateShapeProjection as calculateBuildShapeProjection,
} from '../utils/buildValidation';

type Grid = number[][];
type ColorGrid = string[][];

function makeGrid(rows: number, cols: number): Grid {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
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
  const buildFace = face === 'side' ? 'left' : face;
  return calculateBuildShapeProjection(cubes, buildFace);
}

/**
 * Color projection: each cell shows the color of the first visible cube.
 * front: smallest z wins  |  side: smallest x wins  |  top: largest y wins
 */
export function calculateColorProjection(
  cubes: CubeData[],
  face: 'front' | 'side' | 'top',
): ColorGrid {
  const buildFace = face === 'side' ? 'left' : face;
  return calculateBuildColorProjection(cubes, buildFace).map(row => row.map(cell => cell ?? ''));
}

export function normalizeProjection(grid: number[][]): number[][] {
  if (!grid.length || !grid[0]?.length) return [];
  let top = 0;
  let bottom = grid.length - 1;
  let left = 0;
  let right = grid[0].length - 1;

  while (top <= bottom && grid[top].every(cell => cell === 0)) top++;
  while (bottom >= top && grid[bottom].every(cell => cell === 0)) bottom--;
  while (left <= right && grid.every(row => row[left] === 0)) left++;
  while (right >= left && grid.every(row => row[right] === 0)) right--;

  if (top > bottom || left > right) return [];
  return grid.slice(top, bottom + 1).map(row => row.slice(left, right + 1));
}

export function compareProjection(a: number[][], b: number[][]): boolean {
  const na = normalizeProjection(a);
  const nb = normalizeProjection(b);
  if (na.length !== nb.length) return false;
  if ((na[0]?.length ?? 0) !== (nb[0]?.length ?? 0)) return false;
  return na.every((row, r) => row.every((cell, c) => cell === nb[r][c]));
}

export interface BuildValidationResult {
  success: boolean;
  matchedFaces: Array<keyof TargetProjections>;
  failedFaces: Array<keyof TargetProjections>;
  message: string;
}

const FACE_LABELS: Record<keyof TargetProjections, string> = {
  front: '앞에서 본 모습',
  top: '위에서 본 모습',
  side: '왼쪽에서 본 모습',
};

export function validateBuildMission(cubes: CubeData[], mission: Scene): BuildValidationResult {
  const targets = mission.targetProjections ?? {};
  const faces = Object.keys(targets) as Array<keyof TargetProjections>;
  const matchedFaces: Array<keyof TargetProjections> = [];
  const failedFaces: Array<keyof TargetProjections> = [];

  faces.forEach(face => {
    const target = targets[face];
    if (!target) return;
    const actual = calculateProjection(cubes, face);
    if (compareProjection(actual, target)) matchedFaces.push(face);
    else failedFaces.push(face);
  });

  if (mission.exactCubes !== undefined && cubes.length !== mission.exactCubes) {
    const diff = cubes.length - mission.exactCubes;
    return {
      success: false,
      matchedFaces,
      failedFaces,
      message: diff > 0
        ? `큐브가 ${diff}개 많아요. ${diff}개를 줄여볼까요?`
        : `큐브가 ${Math.abs(diff)}개 부족해요. ${Math.abs(diff)}개를 더 쌓아볼까요?`,
    };
  }

  if (mission.minCubes !== undefined && cubes.length < mission.minCubes) {
    return { success: false, matchedFaces, failedFaces, message: `큐브가 조금 부족해요. 최소 ${mission.minCubes}개가 필요해요.` };
  }

  if (mission.maxCubes !== undefined && cubes.length > mission.maxCubes) {
    return { success: false, matchedFaces, failedFaces, message: '큐브를 너무 많이 쌓았어요!' };
  }

  if (failedFaces.length === 0) {
    return {
      success: true,
      matchedFaces,
      failedFaces,
      message: mission.successText ?? '멋져요! 큐브 구조물이 완성됐어요!',
    };
  }

  if (matchedFaces.length > 0) {
    return {
      success: false,
      matchedFaces,
      failedFaces,
      message: `${matchedFaces.map(face => FACE_LABELS[face]).join(', ')}은 맞았어요! ${FACE_LABELS[failedFaces[0]]}을 다시 확인해봐요.`,
    };
  }

  return {
    success: false,
    matchedFaces,
    failedFaces,
    message: `거의 다 왔어요! ${FACE_LABELS[failedFaces[0]] ?? '목표 모습'}을 다시 확인해봐요.`,
  };
}
