import type { Difficulty, GameResult, LeaderboardEntry } from '../types/game';
import { LEADERBOARD_KEY } from '../utils/constants';

function loadAll(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAll(entries: LeaderboardEntry[]) {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
}

export function saveScore(result: GameResult): LeaderboardEntry {
  const entry: LeaderboardEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    nickname: result.nickname,
    difficulty: result.difficulty,
    stars: result.totalStars,
    maxStars: result.maxStars,
    clearTime: result.totalTimeSeconds,
    grade: result.grade,
    hintsUsed: result.scenes.reduce((s, r) => s + r.hintsUsed, 0),
    createdAt: Date.now(),
  };
  const entries = loadAll();
  entries.push(entry);
  saveAll(entries);
  return entry;
}

export function getByDifficulty(difficulty: Difficulty): LeaderboardEntry[] {
  return loadAll()
    .filter(e => e.difficulty === difficulty)
    .sort((a, b) => b.stars - a.stars || a.clearTime - b.clearTime)
    .slice(0, 50);
}

export function getAll(): LeaderboardEntry[] {
  return loadAll();
}
