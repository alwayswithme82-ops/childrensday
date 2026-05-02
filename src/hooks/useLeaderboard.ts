import { useState, useEffect } from 'react';
import type { Difficulty, LeaderboardEntry } from '../types/game';
import { getByDifficulty } from '../services/leaderboard.service';

export function useLeaderboard(difficulty: Difficulty) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setEntries(getByDifficulty(difficulty));

    const handler = () => setEntries(getByDifficulty(difficulty));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [difficulty]);

  return entries;
}
