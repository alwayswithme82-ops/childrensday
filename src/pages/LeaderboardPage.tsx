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
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg,#FFFDE7 0%,#FCE4EC 50%,#E3F2FD 100%)' }}>
        <TopBar />
        <div className="flex-1 flex flex-col gap-4 px-4 py-6 max-w-lg mx-auto w-full">
          <h1 className="font-fredoka text-3xl text-center" style={{ color: '#FF6B6B' }}>🏆 리더보드</h1>
          <DifficultyTabs active={tab} onChange={setTab} />
          <RankTable entries={entries} myNickname={nickname} />
        </div>
      </div>
    </PageTransition>
  );
}
