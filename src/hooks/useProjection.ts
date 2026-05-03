import { useMemo } from 'react';
import type { CubeData } from '../types/game';
import { calculateColorProjection } from '../services/projection.service';

export function useProjection(cubes: CubeData[]) {
  const frontView = useMemo(() => calculateColorProjection(cubes, 'front'), [cubes]);
  const sideView = useMemo(() => calculateColorProjection(cubes, 'side'), [cubes]);
  const topView = useMemo(() => calculateColorProjection(cubes, 'top'), [cubes]);
  return { frontView, sideView, topView };
}
