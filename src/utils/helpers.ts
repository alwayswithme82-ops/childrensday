import type { Grade, SceneResult } from '../types/game';
import { GRADE_CONFIG } from './constants';

export function calcStars(attempts: number, hintsUsed: number): 1 | 2 | 3 {
  if (attempts === 1 && hintsUsed === 0) return 3;
  if (attempts === 1) return 2;
  return 1;
}

export function calcGrade(totalStars: number, maxStars: number): Grade {
  const ratio = totalStars / maxStars;
  if (ratio >= GRADE_CONFIG['큐브왕'].minPercent) return '큐브왕';
  if (ratio >= GRADE_CONFIG['건축사'].minPercent) return '건축사';
  return '견습생';
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function totalHintsUsed(results: SceneResult[]): number {
  return results.reduce((sum, r) => sum + r.hintsUsed, 0);
}
