import type { CubeData, Scene, TargetProjections } from '../types/game';
import {
  calculateColorProjection as calculateBuildColorProjection,
  calculateShapeProjection as calculateBuildShapeProjection,
  compareGrid as compareBuildGrid,
} from '../utils/buildValidation';
import { normalizeProjectionTo3x3 } from '../utils/projectionGrid';

type Grid = number[][];
type ColorGrid = string[][];

function makeGrid(rows: number, cols: number): Grid {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
}

function toFixedGrid(grid: Grid, gridSize: number, bottomAlignRows: boolean): Grid {
  const out = makeGrid(gridSize, gridSize);
  const rows = Math.min(grid.length, gridSize);
  const rowOffset = bottomAlignRows ? Math.max(0, gridSize - rows) : 0;

  for (let r = 0; r < rows; r++) {
    const row = grid[r] ?? [];
    const targetRow = rowOffset + r;
    for (let c = 0; c < Math.min(row.length, gridSize); c++) {
      out[targetRow][c] = row[c] ? 1 : 0;
    }
  }

  return out;
}

// --- Legacy fixed-size projections (used by existing projectionData option grids) ---

export function getFrontProjection(cubes: CubeData[], gridSize = 4): Grid {
  return toFixedGrid(calculateBuildShapeProjection(cubes, 'front'), gridSize, true);
}

export function getSideProjection(cubes: CubeData[], gridSize = 4): Grid {
  return toFixedGrid(calculateBuildShapeProjection(cubes, 'left'), gridSize, true);
}

export function getTopProjection(cubes: CubeData[], gridSize = 4): Grid {
  return toFixedGrid(calculateBuildShapeProjection(cubes, 'top'), gridSize, false);
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
  return normalizeProjectionTo3x3(grid, 'front');
}

export function compareProjection(a: number[][], b: number[][], face: 'front' | 'side' | 'top' = 'front'): boolean {
  const buildFace = face === 'side' ? 'left' : face;
  return compareBuildGrid(a, b, buildFace);
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
    if (compareProjection(actual, target, face)) matchedFaces.push(face);
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
