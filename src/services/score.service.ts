import type { GameResult } from '../types/game';
import { saveScore as saveToLocalStorage, getByDifficulty } from './leaderboard.service';
import type { Difficulty } from '../types/game';

export async function saveScore(_uid: string, result: GameResult): Promise<string> {
  const entry = saveToLocalStorage(result);
  window.dispatchEvent(new Event('storage'));
  return entry.id;
}

export function getScores(difficulty: Difficulty, limitCount = 50) {
  return getByDifficulty(difficulty).slice(0, limitCount);
}
