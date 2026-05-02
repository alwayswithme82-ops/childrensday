import { useState } from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { TopBar } from '../components/layout/TopBar';
import { DifficultyTabs } from '../components/leaderboard/DifficultyTabs';
import { RankTable } from '../components/leaderboard/RankTable';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useGameStore } from '../stores/useGameStore';
import type { Difficulty } from '../types/game';

export function LeaderboardPage() {
  const [tab, setTab] = useState<Difficulty>('easy');
  const entries = useLeaderboard(tab);
  const { nickname } = useGameStore();

  return (
    <PageTransition>
      <div className="min-h-screen bg-white flex flex-col">
        <TopBar />
        <div className="flex-1 flex flex-col gap-6 px-4 py-8 max-w-lg mx-auto w-full">
          <h1 className="text-2xl font-900 text-gray-800 text-center">🏆 리더보드</h1>
          <DifficultyTabs active={tab} onChange={setTab} />
          <RankTable entries={entries} myNickname={nickname} />
        </div>
      </div>
    </PageTransition>
  );
}
