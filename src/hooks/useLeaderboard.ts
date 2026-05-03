import { useState, useEffect, useCallback } from 'react';
import type { Difficulty, LeaderboardEntry } from '../types/game';
import { getByDifficulty } from '../services/leaderboard.service';

interface LeaderboardState {
  scores: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
}

export function useLeaderboard(difficulty: Difficulty): LeaderboardState & { refetch: () => void } {
  const [state, setState] = useState<LeaderboardState>({
    scores: [],
    loading: true,
    error: null,
  });

  const load = useCallback(() => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const scores = getByDifficulty(difficulty);
      setState({ scores, loading: false, error: null });
    } catch {
      setState(s => ({ ...s, loading: false, error: '데이터를 불러오지 못했어요' }));
    }
  }, [difficulty]);

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [load]);

  return { ...state, refetch: load };
}
